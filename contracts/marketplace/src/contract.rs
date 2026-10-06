#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    from_json, to_json_binary, Addr, BankMsg, Binary, Coin, CosmosMsg, Deps, DepsMut, Env,
    MessageInfo, Response, StdResult, Storage, Uint128, WasmMsg,
};
use cw2::{get_contract_version, set_contract_version};
use cw721::receiver::Cw721ReceiveMsg;
use cw_utils::must_pay;
use serde::Serialize;

use crate::error::ContractError;
use crate::msg::{CollectionInput, ExecuteMsg, InstantiateMsg, MigrateMsg, QueryMsg, ReceiveNftMsg};
use crate::query;
use crate::state::{
    Activity, ActivityKind, Bid, Collection, Config, Listing, ACTIVITY, ACTIVITY_BY_COLLECTION,
    ACTIVITY_BY_TOKEN, ACTIVITY_BY_USER, ACTIVITY_SEQ, BIDS, BIDS_BY_BIDDER, BIDS_BY_TOKEN,
    BID_LOOKUP, BID_SEQ, COLLECTIONS, CONFIG, HOURLY_VOLUME, LISTINGS, LISTINGS_BY_PRICE,
    LISTINGS_BY_SELLER, LISTINGS_BY_SEQ, LISTING_SEQ, STATS,
};

pub const CONTRACT_NAME: &str = "crates.io:cousins-marketplace";
pub const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

pub const MAX_FEE_BPS: u16 = 1_000; // 10%
pub const MAX_ROYALTY_BPS: u16 = 1_500; // 15%
const BPS_DENOMINATOR: u128 = 10_000;
const MAX_NAME_LEN: usize = 64;
const MAX_TEXT_LEN: usize = 1_024;
const MAX_URL_LEN: usize = 512;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    if msg.fee_bps > MAX_FEE_BPS {
        return Err(ContractError::FeeTooHigh { max: MAX_FEE_BPS });
    }
    if msg.denom.trim().is_empty() {
        return Err(invalid("denom", "must not be empty"));
    }
    let admin = match msg.admin {
        Some(a) => deps.api.addr_validate(&a)?,
        None => info.sender,
    };
    let config = Config {
        admin,
        fee_bps: msg.fee_bps,
        fee_recipient: deps.api.addr_validate(&msg.fee_recipient)?,
        denom: msg.denom,
        paused: false,
    };
    CONFIG.save(deps.storage, &config)?;
    LISTING_SEQ.save(deps.storage, &0)?;
    BID_SEQ.save(deps.storage, &0)?;
    ACTIVITY_SEQ.save(deps.storage, &0)?;

    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("admin", config.admin)
        .add_attribute("fee_bps", config.fee_bps.to_string())
        .add_attribute("denom", config.denom))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::ReceiveNft(receive) => execute_receive_nft(deps, env, info, receive),
        ExecuteMsg::UpdatePrice {
            collection,
            token_id,
            price,
        } => execute_update_price(deps, env, info, collection, token_id, price),
        ExecuteMsg::CancelListing {
            collection,
            token_id,
        } => execute_cancel_listing(deps, env, info, collection, token_id),
        ExecuteMsg::Buy {
            collection,
            token_id,
        } => execute_buy(deps, env, info, collection, token_id),
        ExecuteMsg::PlaceBid {
            collection,
            token_id,
        } => execute_place_bid(deps, env, info, collection, token_id),
        ExecuteMsg::CancelBid { bid_id } => execute_cancel_bid(deps, env, info, bid_id),
        ExecuteMsg::AcceptBid { bid_id } => execute_accept_bid(deps, env, info, bid_id),
        ExecuteMsg::SetCollection {
            address,
            collection,
        } => execute_set_collection(deps, env, info, address, collection),
        ExecuteMsg::UpdateConfig {
            admin,
            fee_bps,
            fee_recipient,
            paused,
        } => execute_update_config(deps, info, admin, fee_bps, fee_recipient, paused),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    query::query(deps, env, msg)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(deps: DepsMut, _env: Env, _msg: MigrateMsg) -> Result<Response, ContractError> {
    let previous = get_contract_version(deps.storage)?;
    if previous.contract != CONTRACT_NAME {
        return Err(ContractError::CannotMigrate {
            previous_contract: previous.contract,
            previous_version: previous.version,
        });
    }
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    Ok(Response::new()
        .add_attribute("action", "migrate")
        .add_attribute("from_version", previous.version)
        .add_attribute("to_version", CONTRACT_VERSION))
}

// ---------------------------------------------------------------------------
// Trading
// ---------------------------------------------------------------------------

fn execute_receive_nft(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    receive: Cw721ReceiveMsg,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    ensure_not_paused(&config)?;
    // The cw721 contract itself calls us, so info.sender is the collection.
    let collection_addr = info.sender;
    let collection = load_collection(deps.storage, &collection_addr, true)?;
    let owner = deps.api.addr_validate(&receive.sender)?;
    let token_id = receive.token_id;

    match from_json::<ReceiveNftMsg>(&receive.msg)? {
        ReceiveNftMsg::List { price } => {
            if price.is_zero() {
                return Err(ContractError::ZeroPrice);
            }
            if LISTINGS.has(deps.storage, (&collection_addr, &token_id)) {
                return Err(invalid("token_id", "already listed"));
            }
            let seq = LISTING_SEQ.update(deps.storage, |s| -> StdResult<u64> { Ok(s + 1) })?;
            let listing = Listing {
                collection: collection_addr.clone(),
                token_id: token_id.clone(),
                seller: owner.clone(),
                price,
                listed_at: env.block.time.seconds(),
                seq,
            };
            save_listing(deps.storage, &listing)?;
            STATS.update(deps.storage, &collection_addr, |s| -> StdResult<_> {
                let mut s = s.unwrap_or_default();
                s.listed += 1;
                Ok(s)
            })?;
            record_activity(
                deps.storage,
                &env,
                ActivityKind::List,
                &collection_addr,
                &token_id,
                &owner,
                None,
                price,
            )?;
            Ok(Response::new()
                .add_attribute("action", "list")
                .add_attribute("collection", collection_addr)
                .add_attribute("token_id", token_id)
                .add_attribute("seller", owner)
                .add_attribute("price", price))
        }
        ReceiveNftMsg::AcceptBid { bid_id } => {
            let bid = load_bid(deps.storage, bid_id)?;
            if bid.collection != collection_addr || bid.token_id != token_id {
                return Err(ContractError::BidMismatch);
            }
            if bid.bidder == owner {
                return Err(ContractError::OwnListing);
            }
            remove_bid(deps.storage, &bid)?;
            let msgs = settle_sale(
                deps.storage,
                &env,
                &config,
                &collection,
                &collection_addr,
                &token_id,
                &owner,
                &bid.bidder,
                bid.amount,
            )?;
            record_activity(
                deps.storage,
                &env,
                ActivityKind::AcceptBid,
                &collection_addr,
                &token_id,
                &owner,
                Some(&bid.bidder),
                bid.amount,
            )?;
            Ok(Response::new()
                .add_messages(msgs)
                .add_attribute("action", "accept_bid")
                .add_attribute("collection", collection_addr)
                .add_attribute("token_id", token_id)
                .add_attribute("bid_id", bid_id.to_string())
                .add_attribute("seller", owner)
                .add_attribute("buyer", bid.bidder)
                .add_attribute("price", bid.amount))
        }
    }
}

fn execute_update_price(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    collection: String,
    token_id: String,
    price: Uint128,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    ensure_not_paused(&config)?;
    if price.is_zero() {
        return Err(ContractError::ZeroPrice);
    }
    let collection_addr = deps.api.addr_validate(&collection)?;
    let mut listing = load_listing(deps.storage, &collection_addr, &token_id)?;
    if listing.seller != info.sender {
        return Err(ContractError::NotSeller);
    }
    LISTINGS_BY_PRICE.remove(
        deps.storage,
        (&collection_addr, listing.price.u128(), &token_id),
    );
    listing.price = price;
    save_listing(deps.storage, &listing)?;
    record_activity(
        deps.storage,
        &env,
        ActivityKind::UpdatePrice,
        &collection_addr,
        &token_id,
        &info.sender,
        None,
        price,
    )?;
    Ok(Response::new()
        .add_attribute("action", "update_price")
        .add_attribute("collection", collection_addr)
        .add_attribute("token_id", token_id)
        .add_attribute("price", price))
}

fn execute_cancel_listing(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    collection: String,
    token_id: String,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let collection_addr = deps.api.addr_validate(&collection)?;
    let listing = load_listing(deps.storage, &collection_addr, &token_id)?;
    // The admin may also cancel, e.g. to hand NFTs back from a disabled collection.
    if listing.seller != info.sender && config.admin != info.sender {
        return Err(ContractError::NotSeller);
    }
    remove_listing(deps.storage, &listing)?;
    record_activity(
        deps.storage,
        &env,
        ActivityKind::CancelListing,
        &collection_addr,
        &token_id,
        &listing.seller,
        None,
        listing.price,
    )?;
    Ok(Response::new()
        .add_message(transfer_nft_msg(&collection_addr, &listing.seller, &token_id)?)
        .add_attribute("action", "cancel_listing")
        .add_attribute("collection", collection_addr)
        .add_attribute("token_id", token_id)
        .add_attribute("seller", listing.seller))
}

fn execute_buy(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    collection: String,
    token_id: String,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    ensure_not_paused(&config)?;
    let collection_addr = deps.api.addr_validate(&collection)?;
    let collection_info = load_collection(deps.storage, &collection_addr, true)?;
    let listing = load_listing(deps.storage, &collection_addr, &token_id)?;
    let buyer = info.sender.clone();
    if listing.seller == buyer {
        return Err(ContractError::OwnListing);
    }
    let paid = must_pay(&info, &config.denom)?;
    if paid != listing.price {
        return Err(ContractError::WrongPayment {
            expected: listing.price,
            denom: config.denom,
        });
    }

    remove_listing(deps.storage, &listing)?;
    let mut msgs = settle_sale(
        deps.storage,
        &env,
        &config,
        &collection_info,
        &collection_addr,
        &token_id,
        &listing.seller,
        &buyer,
        listing.price,
    )?;
    record_activity(
        deps.storage,
        &env,
        ActivityKind::Sale,
        &collection_addr,
        &token_id,
        &buyer,
        Some(&listing.seller),
        listing.price,
    )?;

    // The buyer now owns the NFT, so a bid they had on it is pointless: refund it.
    let mut response = Response::new();
    if let Some(bid_id) = BID_LOOKUP.may_load(deps.storage, (&collection_addr, &token_id, &buyer))? {
        let bid = load_bid(deps.storage, bid_id)?;
        remove_bid(deps.storage, &bid)?;
        msgs.push(bank_send(&bid.bidder, bid.amount, &config.denom));
        record_activity(
            deps.storage,
            &env,
            ActivityKind::CancelBid,
            &collection_addr,
            &token_id,
            &buyer,
            None,
            bid.amount,
        )?;
        response = response.add_attribute("refunded_bid_id", bid_id.to_string());
    }

    Ok(response
        .add_messages(msgs)
        .add_attribute("action", "buy")
        .add_attribute("collection", collection_addr)
        .add_attribute("token_id", token_id)
        .add_attribute("seller", listing.seller)
        .add_attribute("buyer", buyer)
        .add_attribute("price", listing.price))
}

fn execute_place_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    collection: String,
    token_id: String,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    ensure_not_paused(&config)?;
    let collection_addr = deps.api.addr_validate(&collection)?;
    load_collection(deps.storage, &collection_addr, true)?;
    if token_id.is_empty() {
        return Err(invalid("token_id", "must not be empty"));
    }
    let amount = must_pay(&info, &config.denom)?;
    let bidder = info.sender;

    if let Some(listing) = LISTINGS.may_load(deps.storage, (&collection_addr, &token_id))? {
        if listing.seller == bidder {
            return Err(ContractError::OwnListing);
        }
    }
    if let Some(existing) = BID_LOOKUP.may_load(deps.storage, (&collection_addr, &token_id, &bidder))? {
        return Err(ContractError::BidExists(existing));
    }

    let id = BID_SEQ.update(deps.storage, |s| -> StdResult<u64> { Ok(s + 1) })?;
    let bid = Bid {
        id,
        collection: collection_addr.clone(),
        token_id: token_id.clone(),
        bidder: bidder.clone(),
        amount,
        created_at: env.block.time.seconds(),
    };
    BIDS.save(deps.storage, id, &bid)?;
    BIDS_BY_TOKEN.save(
        deps.storage,
        ((&collection_addr, &token_id), amount.u128(), id),
        &(),
    )?;
    BIDS_BY_BIDDER.save(deps.storage, (&bidder, id), &())?;
    BID_LOOKUP.save(deps.storage, (&collection_addr, &token_id, &bidder), &id)?;
    record_activity(
        deps.storage,
        &env,
        ActivityKind::Bid,
        &collection_addr,
        &token_id,
        &bidder,
        None,
        amount,
    )?;

    Ok(Response::new()
        .add_attribute("action", "place_bid")
        .add_attribute("collection", collection_addr)
        .add_attribute("token_id", token_id)
        .add_attribute("bid_id", id.to_string())
        .add_attribute("bidder", bidder)
        .add_attribute("amount", amount))
}

fn execute_cancel_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    bid_id: u64,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    let bid = load_bid(deps.storage, bid_id)?;
    // The admin may also cancel; the funds always go back to the bidder.
    if bid.bidder != info.sender && config.admin != info.sender {
        return Err(ContractError::NotBidder);
    }
    remove_bid(deps.storage, &bid)?;
    record_activity(
        deps.storage,
        &env,
        ActivityKind::CancelBid,
        &bid.collection,
        &bid.token_id,
        &bid.bidder,
        None,
        bid.amount,
    )?;
    Ok(Response::new()
        .add_message(bank_send(&bid.bidder, bid.amount, &config.denom))
        .add_attribute("action", "cancel_bid")
        .add_attribute("bid_id", bid_id.to_string())
        .add_attribute("bidder", bid.bidder)
        .add_attribute("amount", bid.amount))
}

fn execute_accept_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    bid_id: u64,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    ensure_not_paused(&config)?;
    let bid = load_bid(deps.storage, bid_id)?;
    let collection_info = load_collection(deps.storage, &bid.collection, true)?;
    let listing = load_listing(deps.storage, &bid.collection, &bid.token_id)?;
    if listing.seller != info.sender {
        return Err(ContractError::NotSeller);
    }
    if bid.bidder == listing.seller {
        return Err(ContractError::OwnListing);
    }

    remove_listing(deps.storage, &listing)?;
    remove_bid(deps.storage, &bid)?;
    let msgs = settle_sale(
        deps.storage,
        &env,
        &config,
        &collection_info,
        &bid.collection,
        &bid.token_id,
        &listing.seller,
        &bid.bidder,
        bid.amount,
    )?;
    record_activity(
        deps.storage,
        &env,
        ActivityKind::AcceptBid,
        &bid.collection,
        &bid.token_id,
        &listing.seller,
        Some(&bid.bidder),
        bid.amount,
    )?;
    Ok(Response::new()
        .add_messages(msgs)
        .add_attribute("action", "accept_bid")
        .add_attribute("collection", bid.collection)
        .add_attribute("token_id", bid.token_id)
        .add_attribute("bid_id", bid_id.to_string())
        .add_attribute("seller", listing.seller)
        .add_attribute("buyer", bid.bidder)
        .add_attribute("price", bid.amount))
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

fn execute_set_collection(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    address: String,
    input: CollectionInput,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    ensure_admin(&config, &info)?;
    let address = deps.api.addr_validate(&address)?;

    let name = input.name.trim().to_string();
    if name.is_empty() || name.chars().count() > MAX_NAME_LEN {
        return Err(invalid("name", "must be 1-64 characters"));
    }
    check_len("description", &input.description, MAX_TEXT_LEN)?;
    for (field, value) in [
        ("image", &input.image),
        ("banner", &input.banner),
        ("website", &input.website),
        ("twitter", &input.twitter),
        ("discord", &input.discord),
    ] {
        check_len(field, value, MAX_URL_LEN)?;
    }
    if input.royalty_bps > MAX_ROYALTY_BPS {
        return Err(ContractError::FeeTooHigh {
            max: MAX_ROYALTY_BPS,
        });
    }
    let royalty_recipient = match (&input.royalty_recipient, input.royalty_bps) {
        (Some(r), _) => Some(deps.api.addr_validate(r)?),
        (None, 0) => None,
        (None, _) => return Err(ContractError::MissingRoyaltyRecipient),
    };

    let registered_at = COLLECTIONS
        .may_load(deps.storage, &address)?
        .map(|c| c.registered_at)
        .unwrap_or_else(|| env.block.time.seconds());

    let collection = Collection {
        name,
        description: input.description,
        image: input.image,
        banner: input.banner,
        website: input.website,
        twitter: input.twitter,
        discord: input.discord,
        royalty_bps: input.royalty_bps,
        royalty_recipient,
        enabled: input.enabled,
        registered_at,
    };
    COLLECTIONS.save(deps.storage, &address, &collection)?;

    Ok(Response::new()
        .add_attribute("action", "set_collection")
        .add_attribute("collection", address)
        .add_attribute("enabled", collection.enabled.to_string()))
}

fn execute_update_config(
    deps: DepsMut,
    info: MessageInfo,
    admin: Option<String>,
    fee_bps: Option<u16>,
    fee_recipient: Option<String>,
    paused: Option<bool>,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    ensure_admin(&config, &info)?;
    if let Some(admin) = admin {
        config.admin = deps.api.addr_validate(&admin)?;
    }
    if let Some(fee_bps) = fee_bps {
        if fee_bps > MAX_FEE_BPS {
            return Err(ContractError::FeeTooHigh { max: MAX_FEE_BPS });
        }
        config.fee_bps = fee_bps;
    }
    if let Some(r) = fee_recipient {
        config.fee_recipient = deps.api.addr_validate(&r)?;
    }
    if let Some(p) = paused {
        config.paused = p;
    }
    CONFIG.save(deps.storage, &config)?;
    Ok(Response::new()
        .add_attribute("action", "update_config")
        .add_attribute("admin", config.admin)
        .add_attribute("fee_bps", config.fee_bps.to_string())
        .add_attribute("paused", config.paused.to_string()))
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn invalid(field: &str, reason: &str) -> ContractError {
    ContractError::InvalidField {
        field: field.to_string(),
        reason: reason.to_string(),
    }
}

fn check_len(field: &str, value: &Option<String>, max: usize) -> Result<(), ContractError> {
    match value {
        Some(v) if v.chars().count() > max => Err(invalid(field, &format!("at most {max} characters"))),
        _ => Ok(()),
    }
}

fn ensure_admin(config: &Config, info: &MessageInfo) -> Result<(), ContractError> {
    if config.admin != info.sender {
        return Err(ContractError::Unauthorized);
    }
    Ok(())
}

fn ensure_not_paused(config: &Config) -> Result<(), ContractError> {
    if config.paused {
        return Err(ContractError::Paused);
    }
    Ok(())
}

fn load_collection(
    storage: &dyn Storage,
    address: &Addr,
    require_enabled: bool,
) -> Result<Collection, ContractError> {
    let collection = COLLECTIONS
        .may_load(storage, address)?
        .ok_or_else(|| ContractError::UnknownCollection(address.to_string()))?;
    if require_enabled && !collection.enabled {
        return Err(ContractError::CollectionDisabled(address.to_string()));
    }
    Ok(collection)
}

fn load_listing(storage: &dyn Storage, collection: &Addr, token_id: &str) -> Result<Listing, ContractError> {
    LISTINGS
        .may_load(storage, (collection, token_id))?
        .ok_or_else(|| ContractError::NotListed {
            token_id: token_id.to_string(),
        })
}

fn load_bid(storage: &dyn Storage, bid_id: u64) -> Result<Bid, ContractError> {
    BIDS.may_load(storage, bid_id)?
        .ok_or(ContractError::BidNotFound(bid_id))
}

fn save_listing(storage: &mut dyn Storage, listing: &Listing) -> StdResult<()> {
    let c = &listing.collection;
    let t = listing.token_id.as_str();
    LISTINGS.save(storage, (c, t), listing)?;
    LISTINGS_BY_PRICE.save(storage, (c, listing.price.u128(), t), &())?;
    LISTINGS_BY_SEQ.save(storage, (c, listing.seq), &listing.token_id)?;
    LISTINGS_BY_SELLER.save(storage, (&listing.seller, c, t), &())?;
    Ok(())
}

fn remove_listing(storage: &mut dyn Storage, listing: &Listing) -> StdResult<()> {
    let c = &listing.collection;
    let t = listing.token_id.as_str();
    LISTINGS.remove(storage, (c, t));
    LISTINGS_BY_PRICE.remove(storage, (c, listing.price.u128(), t));
    LISTINGS_BY_SEQ.remove(storage, (c, listing.seq));
    LISTINGS_BY_SELLER.remove(storage, (&listing.seller, c, t));
    STATS.update(storage, c, |s| -> StdResult<_> {
        let mut s = s.unwrap_or_default();
        s.listed = s.listed.saturating_sub(1);
        Ok(s)
    })?;
    Ok(())
}

fn remove_bid(storage: &mut dyn Storage, bid: &Bid) -> StdResult<()> {
    let c = &bid.collection;
    let t = bid.token_id.as_str();
    BIDS.remove(storage, bid.id);
    BIDS_BY_TOKEN.remove(storage, ((c, t), bid.amount.u128(), bid.id));
    BIDS_BY_BIDDER.remove(storage, (&bid.bidder, bid.id));
    BID_LOOKUP.remove(storage, (c, t, &bid.bidder));
    Ok(())
}

/// Pays the seller, the marketplace and the royalty recipient out of `price`
/// (already held by the contract), sends the NFT to the buyer and updates stats.
#[allow(clippy::too_many_arguments)]
fn settle_sale(
    storage: &mut dyn Storage,
    env: &Env,
    config: &Config,
    collection: &Collection,
    collection_addr: &Addr,
    token_id: &str,
    seller: &Addr,
    buyer: &Addr,
    price: Uint128,
) -> Result<Vec<CosmosMsg>, ContractError> {
    let fee = price.multiply_ratio(config.fee_bps as u128, BPS_DENOMINATOR);
    let royalty = match &collection.royalty_recipient {
        Some(_) => price.multiply_ratio(collection.royalty_bps as u128, BPS_DENOMINATOR),
        None => Uint128::zero(),
    };
    let seller_amount = price.checked_sub(fee)?.checked_sub(royalty)?;

    let mut msgs = vec![transfer_nft_msg(collection_addr, buyer, token_id)?];
    if !seller_amount.is_zero() {
        msgs.push(bank_send(seller, seller_amount, &config.denom));
    }
    if !fee.is_zero() {
        msgs.push(bank_send(&config.fee_recipient, fee, &config.denom));
    }
    if let (Some(recipient), false) = (&collection.royalty_recipient, royalty.is_zero()) {
        msgs.push(bank_send(recipient, royalty, &config.denom));
    }

    let now = env.block.time.seconds();
    STATS.update(storage, collection_addr, |s| -> StdResult<_> {
        let mut s = s.unwrap_or_default();
        s.volume += price;
        s.sales += 1;
        s.last_sale_price = Some(price);
        s.last_sale_at = Some(now);
        Ok(s)
    })?;
    HOURLY_VOLUME.update(storage, (collection_addr, now / 3600), |v| -> StdResult<_> {
        Ok(v.unwrap_or_default() + price)
    })?;

    Ok(msgs)
}

#[allow(clippy::too_many_arguments)]
fn record_activity(
    storage: &mut dyn Storage,
    env: &Env,
    kind: ActivityKind,
    collection: &Addr,
    token_id: &str,
    actor: &Addr,
    counterparty: Option<&Addr>,
    price: Uint128,
) -> StdResult<()> {
    let id = ACTIVITY_SEQ.update(storage, |s| -> StdResult<u64> { Ok(s + 1) })?;
    let activity = Activity {
        id,
        kind,
        collection: collection.clone(),
        token_id: token_id.to_string(),
        actor: actor.clone(),
        counterparty: counterparty.cloned(),
        price,
        timestamp: env.block.time.seconds(),
        height: env.block.height,
    };
    ACTIVITY.save(storage, id, &activity)?;
    ACTIVITY_BY_COLLECTION.save(storage, (collection, id), &())?;
    ACTIVITY_BY_TOKEN.save(storage, (collection, token_id, id), &())?;
    ACTIVITY_BY_USER.save(storage, (actor, id), &())?;
    if let Some(other) = counterparty {
        if other != actor {
            ACTIVITY_BY_USER.save(storage, (other, id), &())?;
        }
    }
    Ok(())
}

fn bank_send(to: &Addr, amount: Uint128, denom: &str) -> CosmosMsg {
    BankMsg::Send {
        to_address: to.to_string(),
        amount: vec![Coin {
            denom: denom.to_string(),
            amount,
        }],
    }
    .into()
}

/// Minimal cw721 message, so this works with any cw721 version (0.16 - 0.22).
#[derive(Serialize)]
#[serde(rename_all = "snake_case")]
enum Cw721Msg {
    TransferNft { recipient: String, token_id: String },
}

fn transfer_nft_msg(collection: &Addr, recipient: &Addr, token_id: &str) -> StdResult<CosmosMsg> {
    Ok(WasmMsg::Execute {
        contract_addr: collection.to_string(),
        msg: to_json_binary(&Cw721Msg::TransferNft {
            recipient: recipient.to_string(),
            token_id: token_id.to_string(),
        })?,
        funds: vec![],
    }
    .into())
}
