use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};
use cw721::receiver::Cw721ReceiveMsg;

use crate::state::{Activity, ActivityKind, Bid, Collection, Config, Listing};

#[cw_serde]
pub struct InstantiateMsg {
    /// Account allowed to register collections and change settings. Defaults to the sender.
    pub admin: Option<String>,
    /// Marketplace fee in basis points (250 = 2.5%). At most 1000 (10%).
    pub fee_bps: u16,
    /// Account that receives the marketplace fee.
    pub fee_recipient: String,
    /// The only coin accepted for prices and bids, e.g. "uluna".
    pub denom: String,
}

/// Collection details set by the admin. Shown on the collection page.
#[cw_serde]
pub struct CollectionInput {
    pub name: String,
    pub description: Option<String>,
    /// Logo image URL (https:// or ipfs://).
    pub image: Option<String>,
    /// Banner image URL (https:// or ipfs://).
    pub banner: Option<String>,
    pub website: Option<String>,
    pub twitter: Option<String>,
    pub discord: Option<String>,
    /// Creator royalty in basis points (450 = 4.5%). At most 1500 (15%).
    pub royalty_bps: u16,
    /// Required when royalty_bps > 0.
    pub royalty_recipient: Option<String>,
    /// Disabled collections can't be listed, bought or bid on; existing
    /// listings and bids can still be cancelled.
    pub enabled: bool,
}

#[cw_serde]
pub enum ExecuteMsg {
    /// Called by a registered cw721 contract when an NFT is sent here with
    /// `send_nft`. The inner `msg` is a [`ReceiveNftMsg`].
    ReceiveNft(Cw721ReceiveMsg),
    /// Change the price of your listing.
    UpdatePrice {
        collection: String,
        token_id: String,
        price: Uint128,
    },
    /// Remove your listing; the NFT is sent back to you.
    CancelListing { collection: String, token_id: String },
    /// Buy a listed NFT. Send exactly the listing price in the marketplace denom.
    Buy { collection: String, token_id: String },
    /// Offer to buy an NFT (listed or not). The attached funds are held by the
    /// contract until the bid is accepted or cancelled.
    PlaceBid { collection: String, token_id: String },
    /// Cancel your bid and get the funds back.
    CancelBid { bid_id: u64 },
    /// Accept a bid on an NFT you have listed here. (To accept a bid on an NFT
    /// that isn't listed, `send_nft` it with `ReceiveNftMsg::AcceptBid`.)
    AcceptBid { bid_id: u64 },

    /// Admin: register or update a collection.
    SetCollection {
        address: String,
        collection: CollectionInput,
    },
    /// Admin: change settings.
    UpdateConfig {
        admin: Option<String>,
        fee_bps: Option<u16>,
        fee_recipient: Option<String>,
        paused: Option<bool>,
    },
}

/// Message attached to `send_nft`.
#[cw_serde]
pub enum ReceiveNftMsg {
    /// List the NFT for sale at this price.
    List { price: Uint128 },
    /// Sell the NFT to this bid right away.
    AcceptBid { bid_id: u64 },
}

#[cw_serde]
pub enum ListingSort {
    PriceAsc,
    PriceDesc,
    Newest,
    Oldest,
}

/// Pagination cursor for `Listings`: pass back the last listing you received.
#[cw_serde]
pub struct ListingCursor {
    pub token_id: String,
    pub price: Uint128,
    pub seq: u64,
}

/// Pagination cursor for `ListingsBySeller`.
#[cw_serde]
pub struct ListingKey {
    pub collection: String,
    pub token_id: String,
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(Config)]
    Config {},
    #[returns(CollectionResponse)]
    Collection { address: String },
    #[returns(CollectionsResponse)]
    Collections {
        start_after: Option<String>,
        limit: Option<u32>,
    },
    #[returns(StatsResponse)]
    Stats { collection: String },
    #[returns(ListingResponse)]
    Listing { collection: String, token_id: String },
    #[returns(ListingsResponse)]
    Listings {
        collection: String,
        sort: Option<ListingSort>,
        start_after: Option<ListingCursor>,
        limit: Option<u32>,
    },
    #[returns(ListingsResponse)]
    ListingsBySeller {
        seller: String,
        start_after: Option<ListingKey>,
        limit: Option<u32>,
    },
    #[returns(BidResponse)]
    Bid { bid_id: u64 },
    /// Bids on one NFT, highest first.
    #[returns(BidsResponse)]
    BidsForToken {
        collection: String,
        token_id: String,
        limit: Option<u32>,
    },
    /// Bids placed by one account, newest first.
    #[returns(BidsResponse)]
    BidsByBidder {
        bidder: String,
        start_before: Option<u64>,
        limit: Option<u32>,
    },
    /// Marketplace history, newest first. Filters can be combined;
    /// `token_id` requires `collection`.
    #[returns(ActivityResponse)]
    Activity {
        collection: Option<String>,
        token_id: Option<String>,
        user: Option<String>,
        kinds: Option<Vec<ActivityKind>>,
        start_before: Option<u64>,
        limit: Option<u32>,
    },
}

#[cw_serde]
pub struct MigrateMsg {}

#[cw_serde]
pub struct StatsResponse {
    /// Total traded volume, in the marketplace denom.
    pub volume: Uint128,
    /// Volume over the last 24 hours.
    pub volume_24h: Uint128,
    pub sales: u64,
    pub listed: u64,
    /// Lowest active listing price.
    pub floor_price: Option<Uint128>,
    pub last_sale_price: Option<Uint128>,
    /// Unix seconds.
    pub last_sale_at: Option<u64>,
}

#[cw_serde]
pub struct CollectionResponse {
    pub address: Addr,
    pub collection: Collection,
    pub stats: StatsResponse,
}

#[cw_serde]
pub struct CollectionsResponse {
    pub collections: Vec<CollectionResponse>,
}

#[cw_serde]
pub struct ListingResponse {
    pub listing: Option<Listing>,
}

#[cw_serde]
pub struct ListingsResponse {
    pub listings: Vec<Listing>,
}

#[cw_serde]
pub struct BidResponse {
    pub bid: Option<Bid>,
}

#[cw_serde]
pub struct BidsResponse {
    pub bids: Vec<Bid>,
}

#[cw_serde]
pub struct ActivityResponse {
    pub activity: Vec<Activity>,
    /// Pass as `start_before` to get the next page. `None` means there is nothing older.
    pub next: Option<u64>,
}
