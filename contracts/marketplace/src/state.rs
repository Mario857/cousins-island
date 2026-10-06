use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct Config {
    pub admin: Addr,
    pub fee_bps: u16,
    pub fee_recipient: Addr,
    pub denom: String,
    /// When paused, nothing can be listed, bought, bid on or accepted.
    /// Cancelling listings and bids always works.
    pub paused: bool,
}

#[cw_serde]
pub struct Collection {
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub banner: Option<String>,
    pub website: Option<String>,
    pub twitter: Option<String>,
    pub discord: Option<String>,
    pub royalty_bps: u16,
    pub royalty_recipient: Option<Addr>,
    pub enabled: bool,
    /// Unix seconds.
    pub registered_at: u64,
}

/// Fee and royalty a sale pays out. Locked into each listing when it's
/// created, so later config changes can't change what the seller receives.
#[cw_serde]
pub struct SaleTerms {
    pub fee_bps: u16,
    pub royalty_bps: u16,
    pub royalty_recipient: Option<Addr>,
}

impl SaleTerms {
    pub fn current(config: &Config, collection: &Collection) -> Self {
        SaleTerms {
            fee_bps: config.fee_bps,
            royalty_bps: if collection.royalty_recipient.is_some() {
                collection.royalty_bps
            } else {
                0
            },
            royalty_recipient: collection.royalty_recipient.clone(),
        }
    }
}

#[cw_serde]
pub struct Listing {
    pub collection: Addr,
    pub token_id: String,
    pub seller: Addr,
    pub price: Uint128,
    /// Unix seconds.
    pub listed_at: u64,
    /// Ever-increasing number used to sort by listing time.
    pub seq: u64,
    /// Fee and royalty locked in when the NFT was listed.
    pub terms: SaleTerms,
}

#[cw_serde]
pub struct Bid {
    pub id: u64,
    pub collection: Addr,
    pub token_id: String,
    pub bidder: Addr,
    pub amount: Uint128,
    /// Unix seconds.
    pub created_at: u64,
}

#[cw_serde]
#[derive(Copy)]
pub enum ActivityKind {
    List,
    UpdatePrice,
    CancelListing,
    /// Bought at the listing price.
    Sale,
    Bid,
    CancelBid,
    /// Sold to a bid.
    AcceptBid,
}

#[cw_serde]
pub struct Activity {
    pub id: u64,
    pub kind: ActivityKind,
    pub collection: Addr,
    pub token_id: String,
    /// Who sent the transaction.
    pub actor: Addr,
    /// For sales: the seller (when the buyer acted) or the buyer (when the
    /// seller accepted a bid). Otherwise empty.
    pub counterparty: Option<Addr>,
    pub price: Uint128,
    /// Unix seconds.
    pub timestamp: u64,
    pub height: u64,
}

impl Activity {
    pub fn seller(&self) -> Option<&Addr> {
        match self.kind {
            ActivityKind::Sale => self.counterparty.as_ref(),
            ActivityKind::AcceptBid => Some(&self.actor),
            _ => None,
        }
    }

    pub fn buyer(&self) -> Option<&Addr> {
        match self.kind {
            ActivityKind::Sale => Some(&self.actor),
            ActivityKind::AcceptBid => self.counterparty.as_ref(),
            _ => None,
        }
    }
}

#[cw_serde]
#[derive(Default)]
pub struct Stats {
    pub volume: Uint128,
    pub sales: u64,
    pub listed: u64,
    pub last_sale_price: Option<Uint128>,
    pub last_sale_at: Option<u64>,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const COLLECTIONS: Map<&Addr, Collection> = Map::new("collections");
pub const STATS: Map<&Addr, Stats> = Map::new("stats");
/// (collection, hour since epoch) -> volume traded in that hour.
pub const HOURLY_VOLUME: Map<(&Addr, u64), Uint128> = Map::new("hourly_volume");

/// (collection, token_id) -> listing.
pub const LISTINGS: Map<(&Addr, &str), Listing> = Map::new("listings");
/// Secondary indexes, kept in sync with LISTINGS.
pub const LISTINGS_BY_PRICE: Map<(&Addr, u128, &str), ()> = Map::new("listings_by_price");
pub const LISTINGS_BY_SEQ: Map<(&Addr, u64), String> = Map::new("listings_by_seq");
pub const LISTINGS_BY_SELLER: Map<(&Addr, &Addr, &str), ()> = Map::new("listings_by_seller");
pub const LISTING_SEQ: Item<u64> = Item::new("listing_seq");

pub const BIDS: Map<u64, Bid> = Map::new("bids");
/// ((collection, token_id), amount, bid_id) so bids come out sorted by amount.
pub const BIDS_BY_TOKEN: Map<((&Addr, &str), u128, u64), ()> = Map::new("bids_by_token");
pub const BIDS_BY_BIDDER: Map<(&Addr, u64), ()> = Map::new("bids_by_bidder");
/// (collection, token_id, bidder) -> bid_id. One open bid per account per NFT.
pub const BID_LOOKUP: Map<(&Addr, &str, &Addr), u64> = Map::new("bid_lookup");
pub const BID_SEQ: Item<u64> = Item::new("bid_seq");

pub const ACTIVITY: Map<u64, Activity> = Map::new("activity");
pub const ACTIVITY_BY_COLLECTION: Map<(&Addr, u64), ()> = Map::new("activity_by_collection");
pub const ACTIVITY_BY_TOKEN: Map<(&Addr, &str, u64), ()> = Map::new("activity_by_token");
pub const ACTIVITY_BY_USER: Map<(&Addr, u64), ()> = Map::new("activity_by_user");
pub const ACTIVITY_SEQ: Item<u64> = Item::new("activity_seq");
