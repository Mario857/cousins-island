//! Integration tests: the marketplace running against a real cw721 contract
//! (cw721-metadata-onchain v0.20, the same code as the test collection).

use cosmwasm_std::testing::MockApi;
use cosmwasm_std::{coins, to_json_binary, Addr, Empty, Uint128};
use cw721::msg::OwnerOfResponse;
use cw721_metadata_onchain::msg as nft_msg;
use cw_multi_test::{App, AppResponse, Contract, ContractWrapper, Executor};

use crate::contract::{execute, instantiate, migrate, query};
use crate::msg::{
    ActivityResponse, BidsResponse, CollectionInput, CollectionResponse, CollectionsResponse,
    ExecuteMsg, InstantiateMsg, ListingCursor, ListingKey, ListingResponse, ListingSort,
    ListingsResponse, MigrateMsg, QueryMsg, ReceiveNftMsg, StatsResponse,
};
use crate::state::{ActivityKind, Config};
use crate::ContractError;

const DENOM: &str = "uluna";
const START_BALANCE: u128 = 1_000_000_000;

fn marketplace_contract() -> Box<dyn Contract<Empty>> {
    Box::new(ContractWrapper::new(execute, instantiate, query).with_migrate(migrate))
}

fn nft_contract() -> Box<dyn Contract<Empty>> {
    Box::new(ContractWrapper::new(
        cw721_metadata_onchain::entry::execute,
        cw721_metadata_onchain::entry::instantiate,
        cw721_metadata_onchain::entry::query,
    ))
}

struct Suite {
    app: App,
    market: Addr,
    nft: Addr,
    admin: Addr,
    fee_recipient: Addr,
    artist: Addr,
    alice: Addr,
    bob: Addr,
    carol: Addr,
}

fn addr(name: &str) -> Addr {
    MockApi::default().addr_make(name)
}

impl Suite {
    /// Marketplace with a 2.5% fee and one collection with a 4.5% royalty.
    /// Alice owns tokens "1".."5"; Bob and Carol have LUNA.
    fn new() -> Self {
        let (admin, fee_recipient, artist) = (addr("admin"), addr("fees"), addr("artist"));
        let (alice, bob, carol) = (addr("alice"), addr("bob"), addr("carol"));
        let funded = [alice.clone(), bob.clone(), carol.clone()];
        let mut app = App::new(|router, _api, storage| {
            for who in funded {
                router
                    .bank
                    .init_balance(storage, &who, coins(START_BALANCE, DENOM))
                    .unwrap();
            }
        });

        let market_code = app.store_code(marketplace_contract());
        let nft_code = app.store_code(nft_contract());

        let market = app
            .instantiate_contract(
                market_code,
                admin.clone(),
                &InstantiateMsg {
                    admin: None,
                    fee_bps: 250,
                    fee_recipient: fee_recipient.to_string(),
                    denom: DENOM.to_string(),
                },
                &[],
                "market",
                Some(admin.to_string()),
            )
            .unwrap();

        let nft = app
            .instantiate_contract(
                nft_code,
                admin.clone(),
                &nft_msg::InstantiateMsg {
                    name: "Cousins".into(),
                    symbol: "COUSIN".into(),
                    collection_info_extension: None,
                    minter: None,
                    creator: None,
                    withdraw_address: None,
                },
                &[],
                "nft",
                None,
            )
            .unwrap();

        for id in 1..=5 {
            app.execute_contract(
                admin.clone(),
                nft.clone(),
                &nft_msg::ExecuteMsg::Mint {
                    token_id: id.to_string(),
                    owner: alice.to_string(),
                    token_uri: None,
                    extension: None,
                },
                &[],
            )
            .unwrap();
        }

        let mut suite = Suite {
            app,
            market,
            nft,
            admin,
            fee_recipient,
            artist,
            alice,
            bob,
            carol,
        };
        suite.set_collection(true).unwrap();
        suite
    }

    fn set_collection(&mut self, enabled: bool) -> anyhow::Result<AppResponse> {
        let msg = ExecuteMsg::SetCollection {
            address: self.nft.to_string(),
            collection: CollectionInput {
                name: "Cousins".into(),
                description: Some("Test collection".into()),
                image: Some("ipfs://logo".into()),
                banner: None,
                website: None,
                twitter: None,
                discord: None,
                royalty_bps: 450,
                royalty_recipient: Some(self.artist.to_string()),
                enabled,
            },
        };
        self.app
            .execute_contract(self.admin.clone(), self.market.clone(), &msg, &[])
    }

    fn send_nft(&mut self, from: &Addr, token_id: &str, msg: &ReceiveNftMsg) -> anyhow::Result<AppResponse> {
        self.send_nft_to(from, &self.nft.clone(), token_id, msg)
    }

    fn send_nft_to(
        &mut self,
        from: &Addr,
        nft: &Addr,
        token_id: &str,
        msg: &ReceiveNftMsg,
    ) -> anyhow::Result<AppResponse> {
        self.app.execute_contract(
            from.clone(),
            nft.clone(),
            &nft_msg::ExecuteMsg::SendNft {
                contract: self.market.to_string(),
                token_id: token_id.to_string(),
                msg: to_json_binary(msg).unwrap(),
            },
            &[],
        )
    }

    fn list(&mut self, from: &Addr, token_id: &str, price: u128) -> anyhow::Result<AppResponse> {
        let from = from.clone();
        self.send_nft(&from, token_id, &ReceiveNftMsg::List { price: price.into() })
    }

    fn exec(&mut self, from: &Addr, msg: ExecuteMsg, funds: u128) -> anyhow::Result<AppResponse> {
        let funds = if funds > 0 { coins(funds, DENOM) } else { vec![] };
        self.app
            .execute_contract(from.clone(), self.market.clone(), &msg, &funds)
    }

    fn buy(&mut self, from: &Addr, token_id: &str, funds: u128) -> anyhow::Result<AppResponse> {
        let msg = ExecuteMsg::Buy {
            collection: self.nft.to_string(),
            token_id: token_id.into(),
        };
        self.exec(from, msg, funds)
    }

    fn bid(&mut self, from: &Addr, token_id: &str, amount: u128) -> anyhow::Result<AppResponse> {
        let msg = ExecuteMsg::PlaceBid {
            collection: self.nft.to_string(),
            token_id: token_id.into(),
        };
        self.exec(from, msg, amount)
    }

    fn q<T: serde::de::DeserializeOwned>(&self, msg: &QueryMsg) -> T {
        self.app.wrap().query_wasm_smart(&self.market, msg).unwrap()
    }

    fn owner_of(&self, token_id: &str) -> Addr {
        let resp: OwnerOfResponse = self
            .app
            .wrap()
            .query_wasm_smart(
                &self.nft,
                &nft_msg::QueryMsg::OwnerOf {
                    token_id: token_id.into(),
                    include_expired: None,
                },
            )
            .unwrap();
        Addr::unchecked(resp.owner)
    }

    fn balance(&self, who: &Addr) -> u128 {
        self.app.wrap().query_balance(who, DENOM).unwrap().amount.u128()
    }

    fn stats(&self) -> StatsResponse {
        self.q(&QueryMsg::Stats {
            collection: self.nft.to_string(),
        })
    }

    fn listings(&self, sort: ListingSort, start_after: Option<ListingCursor>, limit: u32) -> Vec<(String, u128)> {
        let resp: ListingsResponse = self.q(&QueryMsg::Listings {
            collection: self.nft.to_string(),
            sort: Some(sort),
            start_after,
            limit: Some(limit),
        });
        resp.listings
            .into_iter()
            .map(|l| (l.token_id, l.price.u128()))
            .collect()
    }

    fn activity(&self, collection: bool, token_id: Option<&str>, user: Option<&Addr>, kinds: Option<Vec<ActivityKind>>, start_before: Option<u64>, limit: u32) -> ActivityResponse {
        self.q(&QueryMsg::Activity {
            collection: collection.then(|| self.nft.to_string()),
            token_id: token_id.map(String::from),
            user: user.map(|u| u.to_string()),
            kinds,
            start_before,
            limit: Some(limit),
        })
    }
}

fn err(result: anyhow::Result<AppResponse>) -> ContractError {
    result.unwrap_err().downcast::<ContractError>().unwrap()
}

#[test]
fn instantiate_rejects_high_fee() {
    let mut app = App::default();
    let code = app.store_code(marketplace_contract());
    let res = app.instantiate_contract(
        code,
        addr("admin"),
        &InstantiateMsg {
            admin: None,
            fee_bps: 1_001,
            fee_recipient: addr("fees").to_string(),
            denom: DENOM.into(),
        },
        &[],
        "market",
        None,
    );
    assert_eq!(
        res.unwrap_err().downcast::<ContractError>().unwrap(),
        ContractError::FeeTooHigh { max: 1_000 }
    );
}

#[test]
fn only_admin_registers_collections() {
    let mut s = Suite::new();
    let msg = ExecuteMsg::SetCollection {
        address: s.nft.to_string(),
        collection: CollectionInput {
            name: "Hijack".into(),
            description: None,
            image: None,
            banner: None,
            website: None,
            twitter: None,
            discord: None,
            royalty_bps: 0,
            royalty_recipient: None,
            enabled: true,
        },
    };
    let alice = s.alice.clone();
    assert_eq!(err(s.exec(&alice, msg, 0)), ContractError::Unauthorized);

    let admin = s.admin.clone();
    let mut bad = CollectionInput {
        name: "x".into(),
        description: None,
        image: None,
        banner: None,
        website: None,
        twitter: None,
        discord: None,
        royalty_bps: 100,
        royalty_recipient: None,
        enabled: true,
    };
    let nft = s.nft.to_string();
    assert_eq!(
        err(s.exec(&admin, ExecuteMsg::SetCollection { address: nft.clone(), collection: bad.clone() }, 0)),
        ContractError::MissingRoyaltyRecipient
    );
    bad.royalty_bps = 1_501;
    bad.royalty_recipient = Some(admin.to_string());
    assert_eq!(
        err(s.exec(&admin, ExecuteMsg::SetCollection { address: nft, collection: bad }, 0)),
        ContractError::FeeTooHigh { max: 1_500 }
    );

    let resp: CollectionsResponse = s.q(&QueryMsg::Collections { start_after: None, limit: None });
    assert_eq!(resp.collections.len(), 1);
    assert_eq!(resp.collections[0].collection.name, "Cousins");
    assert_eq!(resp.collections[0].collection.royalty_bps, 450);
}

#[test]
fn list_and_buy_pays_everyone_and_moves_the_nft() {
    let mut s = Suite::new();
    let (alice, bob) = (s.alice.clone(), s.bob.clone());

    s.list(&alice, "1", 10_000_000).unwrap();
    // The NFT is held in escrow by the marketplace.
    assert_eq!(s.owner_of("1"), s.market);
    let listing: ListingResponse = s.q(&QueryMsg::Listing { collection: s.nft.to_string(), token_id: "1".into() });
    let listing = listing.listing.unwrap();
    assert_eq!(listing.seller, alice);
    assert_eq!(listing.price, Uint128::new(10_000_000));
    let stats = s.stats();
    assert_eq!(stats.listed, 1);
    assert_eq!(stats.floor_price, Some(Uint128::new(10_000_000)));

    s.buy(&bob, "1", 10_000_000).unwrap();

    assert_eq!(s.owner_of("1"), bob);
    // 2.5% fee, 4.5% royalty, 93% to the seller.
    assert_eq!(s.balance(&s.fee_recipient), 250_000);
    assert_eq!(s.balance(&s.artist), 450_000);
    assert_eq!(s.balance(&alice), START_BALANCE + 9_300_000);
    assert_eq!(s.balance(&bob), START_BALANCE - 10_000_000);
    assert_eq!(s.balance(&s.market), 0);

    let stats = s.stats();
    assert_eq!(stats.listed, 0);
    assert_eq!(stats.sales, 1);
    assert_eq!(stats.volume, Uint128::new(10_000_000));
    assert_eq!(stats.volume_24h, Uint128::new(10_000_000));
    assert_eq!(stats.floor_price, None);
    assert_eq!(stats.last_sale_price, Some(Uint128::new(10_000_000)));

    let resp: ListingResponse = s.q(&QueryMsg::Listing { collection: s.nft.to_string(), token_id: "1".into() });
    assert!(resp.listing.is_none());
}

#[test]
fn volume_24h_drops_old_sales() {
    let mut s = Suite::new();
    let (alice, bob) = (s.alice.clone(), s.bob.clone());
    s.list(&alice, "1", 1_000).unwrap();
    s.buy(&bob, "1", 1_000).unwrap();
    s.app.update_block(|b| b.time = b.time.plus_seconds(25 * 3600));
    s.list(&alice, "2", 3_000).unwrap();
    s.buy(&bob, "2", 3_000).unwrap();
    let stats = s.stats();
    assert_eq!(stats.volume, Uint128::new(4_000));
    assert_eq!(stats.volume_24h, Uint128::new(3_000));
}

#[test]
fn buy_requires_exact_payment_and_rejects_own_listing() {
    let mut s = Suite::new();
    let (alice, bob) = (s.alice.clone(), s.bob.clone());
    s.list(&alice, "1", 5_000).unwrap();

    assert_eq!(
        err(s.buy(&bob, "1", 4_999)),
        ContractError::WrongPayment { expected: Uint128::new(5_000), denom: DENOM.into() }
    );
    assert_eq!(
        err(s.buy(&bob, "1", 5_001)),
        ContractError::WrongPayment { expected: Uint128::new(5_000), denom: DENOM.into() }
    );
    assert!(matches!(err(s.buy(&bob, "1", 0)), ContractError::Payment(_)));
    assert_eq!(err(s.buy(&alice, "1", 5_000)), ContractError::OwnListing);
    assert_eq!(err(s.buy(&bob, "2", 5_000)), ContractError::NotListed { token_id: "2".into() });
    // Nothing moved.
    assert_eq!(s.balance(&bob), START_BALANCE);
    assert_eq!(s.owner_of("1"), s.market);
}

#[test]
fn unregistered_collection_cannot_list() {
    let mut s = Suite::new();
    let admin = s.admin.clone();
    let alice = s.alice.clone();
    let code = s.app.store_code(nft_contract());
    let other = s
        .app
        .instantiate_contract(
            code,
            admin.clone(),
            &nft_msg::InstantiateMsg {
                name: "Other".into(),
                symbol: "OTH".into(),
                collection_info_extension: None,
                minter: None,
                creator: None,
                withdraw_address: None,
            },
            &[],
            "other",
            None,
        )
        .unwrap();
    s.app
        .execute_contract(
            admin,
            other.clone(),
            &nft_msg::ExecuteMsg::Mint {
                token_id: "1".into(),
                owner: alice.to_string(),
                token_uri: None,
                extension: None,
            },
            &[],
        )
        .unwrap();
    let e = err(s.send_nft_to(&alice, &other, "1", &ReceiveNftMsg::List { price: 10u128.into() }));
    assert_eq!(e, ContractError::UnknownCollection(other.to_string()));
    // The failed transaction is reverted, so Alice still owns it.
    let resp: OwnerOfResponse = s
        .app
        .wrap()
        .query_wasm_smart(&other, &nft_msg::QueryMsg::OwnerOf { token_id: "1".into(), include_expired: None })
        .unwrap();
    assert_eq!(resp.owner, alice.to_string());
}

#[test]
fn zero_price_is_rejected() {
    let mut s = Suite::new();
    let alice = s.alice.clone();
    assert_eq!(err(s.list(&alice, "1", 0)), ContractError::ZeroPrice);
}

#[test]
fn cancel_listing_returns_the_nft() {
    let mut s = Suite::new();
    let (alice, bob, admin) = (s.alice.clone(), s.bob.clone(), s.admin.clone());
    let nft = s.nft.to_string();
    s.list(&alice, "1", 5_000).unwrap();
    s.list(&alice, "2", 5_000).unwrap();

    let cancel = |t: &str| ExecuteMsg::CancelListing { collection: nft.clone(), token_id: t.into() };
    assert_eq!(err(s.exec(&bob, cancel("1"), 0)), ContractError::NotSeller);
    s.exec(&alice, cancel("1"), 0).unwrap();
    assert_eq!(s.owner_of("1"), alice);
    // The admin can cancel too; the NFT still goes back to the seller.
    s.exec(&admin, cancel("2"), 0).unwrap();
    assert_eq!(s.owner_of("2"), alice);
    assert_eq!(s.stats().listed, 0);
}

#[test]
fn update_price_and_sorting() {
    let mut s = Suite::new();
    let alice = s.alice.clone();
    s.list(&alice, "1", 300).unwrap();
    s.list(&alice, "2", 100).unwrap();
    s.list(&alice, "3", 200).unwrap();
    s.list(&alice, "4", 100).unwrap();

    assert_eq!(
        s.listings(ListingSort::PriceAsc, None, 10),
        vec![("2".into(), 100), ("4".into(), 100), ("3".into(), 200), ("1".into(), 300)]
    );
    assert_eq!(
        s.listings(ListingSort::PriceDesc, None, 10),
        vec![("1".into(), 300), ("3".into(), 200), ("4".into(), 100), ("2".into(), 100)]
    );
    assert_eq!(
        s.listings(ListingSort::Newest, None, 10).iter().map(|l| l.0.as_str()).collect::<Vec<_>>(),
        vec!["4", "3", "2", "1"]
    );
    assert_eq!(
        s.listings(ListingSort::Oldest, None, 10).iter().map(|l| l.0.as_str()).collect::<Vec<_>>(),
        vec!["1", "2", "3", "4"]
    );

    // Pagination with a cursor built from the last listing of the previous page.
    let page1: ListingsResponse = s.q(&QueryMsg::Listings {
        collection: s.nft.to_string(),
        sort: Some(ListingSort::PriceAsc),
        start_after: None,
        limit: Some(2),
    });
    let last = page1.listings.last().unwrap();
    let cursor = ListingCursor { token_id: last.token_id.clone(), price: last.price, seq: last.seq };
    assert_eq!(
        s.listings(ListingSort::PriceAsc, Some(cursor.clone()), 10),
        vec![("3".into(), 200), ("1".into(), 300)]
    );
    assert_eq!(
        s.listings(ListingSort::Newest, Some(cursor), 10).iter().map(|l| l.0.as_str()).collect::<Vec<_>>(),
        vec!["3", "2", "1"]
    );

    // Repricing moves the listing in the price index and the floor.
    let msg = ExecuteMsg::UpdatePrice { collection: s.nft.to_string(), token_id: "1".into(), price: 50u128.into() };
    s.exec(&alice, msg, 0).unwrap();
    assert_eq!(s.listings(ListingSort::PriceAsc, None, 1), vec![("1".into(), 50)]);
    assert_eq!(s.stats().floor_price, Some(Uint128::new(50)));
    assert_eq!(s.listings(ListingSort::PriceAsc, None, 10).len(), 4);

    let bob = s.bob.clone();
    let msg = ExecuteMsg::UpdatePrice { collection: s.nft.to_string(), token_id: "1".into(), price: 1u128.into() };
    assert_eq!(err(s.exec(&bob, msg, 0)), ContractError::NotSeller);
}

#[test]
fn listings_by_seller_pages() {
    let mut s = Suite::new();
    let alice = s.alice.clone();
    for t in ["1", "2", "3"] {
        s.list(&alice, t, 10).unwrap();
    }
    let page1: ListingsResponse = s.q(&QueryMsg::ListingsBySeller { seller: alice.to_string(), start_after: None, limit: Some(2) });
    assert_eq!(page1.listings.len(), 2);
    let last = page1.listings.last().unwrap();
    let page2: ListingsResponse = s.q(&QueryMsg::ListingsBySeller {
        seller: alice.to_string(),
        start_after: Some(ListingKey { collection: last.collection.to_string(), token_id: last.token_id.clone() }),
        limit: Some(2),
    });
    assert_eq!(page2.listings.len(), 1);
    assert_eq!(page2.listings[0].token_id, "3");
}

#[test]
fn bids_are_escrowed_and_refunded() {
    let mut s = Suite::new();
    let (alice, bob, carol) = (s.alice.clone(), s.bob.clone(), s.carol.clone());

    s.bid(&bob, "1", 700).unwrap();
    s.bid(&carol, "1", 900).unwrap();
    assert_eq!(s.balance(&s.market), 1_600);
    assert_eq!(s.balance(&bob), START_BALANCE - 700);
    assert_eq!(err(s.bid(&bob, "1", 800)), ContractError::BidExists(1));

    let bids: BidsResponse = s.q(&QueryMsg::BidsForToken { collection: s.nft.to_string(), token_id: "1".into(), limit: None });
    assert_eq!(bids.bids.iter().map(|b| b.amount.u128()).collect::<Vec<_>>(), vec![900, 700]);

    assert_eq!(err(s.exec(&alice, ExecuteMsg::CancelBid { bid_id: 1 }, 0)), ContractError::NotBidder);
    s.exec(&bob, ExecuteMsg::CancelBid { bid_id: 1 }, 0).unwrap();
    assert_eq!(s.balance(&bob), START_BALANCE);
    assert_eq!(err(s.exec(&bob, ExecuteMsg::CancelBid { bid_id: 1 }, 0)), ContractError::BidNotFound(1));

    let mine: BidsResponse = s.q(&QueryMsg::BidsByBidder { bidder: carol.to_string(), start_before: None, limit: None });
    assert_eq!(mine.bids.len(), 1);
    // Bob can bid again after cancelling.
    s.bid(&bob, "1", 800).unwrap();
}

#[test]
fn accept_bid_on_unlisted_nft_via_send_nft() {
    let mut s = Suite::new();
    let (alice, bob) = (s.alice.clone(), s.bob.clone());
    s.bid(&bob, "1", 1_000_000).unwrap();

    // Bid id for a different token is rejected.
    assert_eq!(err(s.send_nft(&alice, "2", &ReceiveNftMsg::AcceptBid { bid_id: 1 })), ContractError::BidMismatch);

    s.send_nft(&alice, "1", &ReceiveNftMsg::AcceptBid { bid_id: 1 }).unwrap();
    assert_eq!(s.owner_of("1"), bob);
    assert_eq!(s.balance(&alice), START_BALANCE + 930_000);
    assert_eq!(s.balance(&s.fee_recipient), 25_000);
    assert_eq!(s.balance(&s.artist), 45_000);
    assert_eq!(s.balance(&s.market), 0);
    assert_eq!(s.stats().sales, 1);
}

#[test]
fn accept_bid_on_listed_nft() {
    let mut s = Suite::new();
    let (alice, bob, carol) = (s.alice.clone(), s.bob.clone(), s.carol.clone());
    s.list(&alice, "1", 2_000_000).unwrap();
    s.bid(&bob, "1", 1_500_000).unwrap();

    assert_eq!(err(s.exec(&carol, ExecuteMsg::AcceptBid { bid_id: 1 }, 0)), ContractError::NotSeller);
    s.exec(&alice, ExecuteMsg::AcceptBid { bid_id: 1 }, 0).unwrap();
    assert_eq!(s.owner_of("1"), bob);
    assert_eq!(s.balance(&alice), START_BALANCE + 1_395_000);
    let stats = s.stats();
    assert_eq!(stats.listed, 0);
    assert_eq!(stats.volume, Uint128::new(1_500_000));
    let resp: ListingResponse = s.q(&QueryMsg::Listing { collection: s.nft.to_string(), token_id: "1".into() });
    assert!(resp.listing.is_none());
}

#[test]
fn cannot_bid_on_own_listing() {
    let mut s = Suite::new();
    let alice = s.alice.clone();
    s.list(&alice, "1", 10).unwrap();
    assert_eq!(err(s.bid(&alice, "1", 5)), ContractError::OwnListing);
}

#[test]
fn buying_refunds_the_buyers_own_bid() {
    let mut s = Suite::new();
    let (alice, bob) = (s.alice.clone(), s.bob.clone());
    s.bid(&bob, "1", 400).unwrap();
    s.list(&alice, "1", 1_000).unwrap();
    s.buy(&bob, "1", 1_000).unwrap();
    // Paid 1000, got the 400 bid back.
    assert_eq!(s.balance(&bob), START_BALANCE - 1_000);
    assert_eq!(s.balance(&s.market), 0);
    let bids: BidsResponse = s.q(&QueryMsg::BidsForToken { collection: s.nft.to_string(), token_id: "1".into(), limit: None });
    assert!(bids.bids.is_empty());
}

#[test]
fn pause_blocks_trading_but_not_cancelling() {
    let mut s = Suite::new();
    let (alice, bob, admin) = (s.alice.clone(), s.bob.clone(), s.admin.clone());
    s.list(&alice, "1", 1_000).unwrap();
    s.bid(&bob, "2", 500).unwrap();

    let pause = |p: bool| ExecuteMsg::UpdateConfig { admin: None, fee_bps: None, fee_recipient: None, paused: Some(p) };
    assert_eq!(err(s.exec(&alice, pause(true), 0)), ContractError::Unauthorized);
    s.exec(&admin, pause(true), 0).unwrap();

    assert_eq!(err(s.buy(&bob, "1", 1_000)), ContractError::Paused);
    assert_eq!(err(s.list(&alice, "3", 1_000)), ContractError::Paused);
    assert_eq!(err(s.bid(&bob, "3", 10)), ContractError::Paused);
    assert_eq!(err(s.send_nft(&alice, "2", &ReceiveNftMsg::AcceptBid { bid_id: 1 })), ContractError::Paused);

    let nft = s.nft.to_string();
    s.exec(&alice, ExecuteMsg::CancelListing { collection: nft, token_id: "1".into() }, 0).unwrap();
    s.exec(&bob, ExecuteMsg::CancelBid { bid_id: 1 }, 0).unwrap();
    assert_eq!(s.owner_of("1"), alice);
    assert_eq!(s.balance(&bob), START_BALANCE);

    s.exec(&admin, pause(false), 0).unwrap();
    s.list(&alice, "1", 1_000).unwrap();
}

#[test]
fn disabled_collection_blocks_trading() {
    let mut s = Suite::new();
    let (alice, bob) = (s.alice.clone(), s.bob.clone());
    s.list(&alice, "1", 1_000).unwrap();
    s.set_collection(false).unwrap();
    let nft = s.nft.to_string();
    assert_eq!(err(s.buy(&bob, "1", 1_000)), ContractError::CollectionDisabled(nft.clone()));
    assert_eq!(err(s.list(&alice, "2", 1_000)), ContractError::CollectionDisabled(nft.clone()));
    assert_eq!(err(s.bid(&bob, "2", 1_000)), ContractError::CollectionDisabled(nft.clone()));
    // Seller can still get the NFT back.
    s.exec(&alice, ExecuteMsg::CancelListing { collection: nft, token_id: "1".into() }, 0).unwrap();
    assert_eq!(s.owner_of("1"), alice);
}

#[test]
fn update_config_changes_fee() {
    let mut s = Suite::new();
    let (alice, bob, admin, carol) = (s.alice.clone(), s.bob.clone(), s.admin.clone(), s.carol.clone());
    let msg = ExecuteMsg::UpdateConfig { admin: None, fee_bps: Some(1_001), fee_recipient: None, paused: None };
    assert_eq!(err(s.exec(&admin, msg, 0)), ContractError::FeeTooHigh { max: 1_000 });
    let msg = ExecuteMsg::UpdateConfig {
        admin: Some(carol.to_string()),
        fee_bps: Some(0),
        fee_recipient: None,
        paused: None,
    };
    s.exec(&admin, msg, 0).unwrap();
    let config: Config = s.q(&QueryMsg::Config {});
    assert_eq!(config.admin, carol);
    assert_eq!(config.fee_bps, 0);
    s.list(&alice, "1", 1_000).unwrap();
    s.buy(&bob, "1", 1_000).unwrap();
    assert_eq!(s.balance(&s.fee_recipient), 0);
    assert_eq!(s.balance(&alice), START_BALANCE + 955);
}

#[test]
fn activity_log_and_filters() {
    let mut s = Suite::new();
    let (alice, bob, carol) = (s.alice.clone(), s.bob.clone(), s.carol.clone());
    s.list(&alice, "1", 1_000).unwrap(); // 1 List
    s.bid(&carol, "1", 500).unwrap(); // 2 Bid
    s.buy(&bob, "1", 1_000).unwrap(); // 3 Sale
    s.list(&alice, "2", 2_000).unwrap(); // 4 List
    let nft = s.nft.to_string();
    s.exec(&alice, ExecuteMsg::UpdatePrice { collection: nft.clone(), token_id: "2".into(), price: 1_500u128.into() }, 0).unwrap(); // 5
    s.exec(&alice, ExecuteMsg::CancelListing { collection: nft, token_id: "2".into() }, 0).unwrap(); // 6
    s.exec(&carol, ExecuteMsg::CancelBid { bid_id: 1 }, 0).unwrap(); // 7

    let all = s.activity(false, None, None, None, None, 100);
    assert_eq!(all.activity.iter().map(|a| a.id).collect::<Vec<_>>(), vec![7, 6, 5, 4, 3, 2, 1]);
    assert_eq!(all.next, None);

    let sale = &all.activity[4];
    assert_eq!(sale.kind, ActivityKind::Sale);
    assert_eq!(sale.buyer(), Some(&bob));
    assert_eq!(sale.seller(), Some(&alice));

    // Bob only appears as buyer of the sale.
    let bobs = s.activity(false, None, Some(&bob), None, None, 100);
    assert_eq!(bobs.activity.iter().map(|a| a.id).collect::<Vec<_>>(), vec![3]);
    // Alice is seller in the sale too.
    let alices = s.activity(false, None, Some(&alice), None, None, 100);
    assert_eq!(alices.activity.iter().map(|a| a.id).collect::<Vec<_>>(), vec![6, 5, 4, 3, 1]);

    let token1 = s.activity(true, Some("1"), None, None, None, 100);
    assert_eq!(token1.activity.iter().map(|a| a.id).collect::<Vec<_>>(), vec![7, 3, 2, 1]);

    let sales = s.activity(true, None, None, Some(vec![ActivityKind::Sale, ActivityKind::AcceptBid]), None, 100);
    assert_eq!(sales.activity.len(), 1);

    // Paging.
    let page1 = s.activity(true, None, None, None, None, 3);
    assert_eq!(page1.activity.iter().map(|a| a.id).collect::<Vec<_>>(), vec![7, 6, 5]);
    assert_eq!(page1.next, Some(5));
    let page2 = s.activity(true, None, None, None, page1.next, 3);
    assert_eq!(page2.activity.iter().map(|a| a.id).collect::<Vec<_>>(), vec![4, 3, 2]);
    let page3 = s.activity(true, None, None, None, page2.next, 3);
    assert_eq!(page3.activity.iter().map(|a| a.id).collect::<Vec<_>>(), vec![1]);
    assert_eq!(page3.next, None);

    // token_id without collection is an error.
    let res: Result<ActivityResponse, _> = s.app.wrap().query_wasm_smart(
        &s.market,
        &QueryMsg::Activity { collection: None, token_id: Some("1".into()), user: None, kinds: None, start_before: None, limit: None },
    );
    assert!(res.is_err());
}

#[test]
fn collection_query_includes_stats() {
    let mut s = Suite::new();
    let (alice, bob) = (s.alice.clone(), s.bob.clone());
    s.list(&alice, "1", 100).unwrap();
    s.list(&alice, "2", 200).unwrap();
    s.buy(&bob, "2", 200).unwrap();
    let resp: CollectionResponse = s.q(&QueryMsg::Collection { address: s.nft.to_string() });
    assert_eq!(resp.stats.listed, 1);
    assert_eq!(resp.stats.floor_price, Some(Uint128::new(100)));
    assert_eq!(resp.stats.sales, 1);
    assert_eq!(resp.collection.image.as_deref(), Some("ipfs://logo"));
}

#[test]
fn migrate_keeps_state() {
    let mut s = Suite::new();
    let alice = s.alice.clone();
    s.list(&alice, "1", 100).unwrap();
    let code = s.app.store_code(marketplace_contract());
    s.app
        .migrate_contract(s.admin.clone(), s.market.clone(), &MigrateMsg {}, code)
        .unwrap();
    assert_eq!(s.stats().listed, 1);
}
