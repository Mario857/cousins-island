use cosmwasm_std::{to_json_binary, Addr, Binary, Deps, Env, Order, StdError, StdResult, Uint128};
use cw_storage_plus::Bound;

use crate::msg::{
    ActivityResponse, BidResponse, BidsResponse, CollectionResponse, CollectionsResponse,
    ListingCursor, ListingKey, ListingResponse, ListingSort, ListingsResponse, QueryMsg,
    StatsResponse,
};
use crate::state::{
    ActivityKind, Bid, Listing, ACTIVITY, ACTIVITY_BY_COLLECTION, ACTIVITY_BY_TOKEN,
    ACTIVITY_BY_USER, BIDS, BIDS_BY_BIDDER, BIDS_BY_TOKEN, COLLECTIONS, CONFIG, HOURLY_VOLUME,
    LISTINGS, LISTINGS_BY_PRICE, LISTINGS_BY_SELLER, LISTINGS_BY_SEQ, STATS,
};

const DEFAULT_LIMIT: u32 = 30;
const MAX_LIMIT: u32 = 100;
const MAX_COLLECTIONS_LIMIT: u32 = 50;
/// Upper bound on entries scanned by one filtered activity query, to keep gas bounded.
const MAX_ACTIVITY_SCAN: usize = 500;

fn limit_or_default(limit: Option<u32>, max: u32) -> usize {
    limit.unwrap_or(DEFAULT_LIMIT).clamp(1, max) as usize
}

pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_json_binary(&CONFIG.load(deps.storage)?),
        QueryMsg::Collection { address } => {
            let addr = deps.api.addr_validate(&address)?;
            to_json_binary(&collection_response(deps, &env, addr)?)
        }
        QueryMsg::Collections { start_after, limit } => {
            to_json_binary(&query_collections(deps, &env, start_after, limit)?)
        }
        QueryMsg::Stats { collection } => {
            let addr = deps.api.addr_validate(&collection)?;
            to_json_binary(&stats_for(deps, &env, &addr)?)
        }
        QueryMsg::Listing {
            collection,
            token_id,
        } => {
            let addr = deps.api.addr_validate(&collection)?;
            to_json_binary(&ListingResponse {
                listing: LISTINGS.may_load(deps.storage, (&addr, &token_id))?,
            })
        }
        QueryMsg::Listings {
            collection,
            sort,
            start_after,
            limit,
        } => to_json_binary(&query_listings(
            deps,
            collection,
            sort.unwrap_or(ListingSort::Newest),
            start_after,
            limit,
        )?),
        QueryMsg::ListingsBySeller {
            seller,
            start_after,
            limit,
        } => to_json_binary(&query_listings_by_seller(deps, seller, start_after, limit)?),
        QueryMsg::Bid { bid_id } => to_json_binary(&BidResponse {
            bid: BIDS.may_load(deps.storage, bid_id)?,
        }),
        QueryMsg::BidsForToken {
            collection,
            token_id,
            limit,
        } => to_json_binary(&query_bids_for_token(deps, collection, token_id, limit)?),
        QueryMsg::BidsByBidder {
            bidder,
            start_before,
            limit,
        } => to_json_binary(&query_bids_by_bidder(deps, bidder, start_before, limit)?),
        QueryMsg::Activity {
            collection,
            token_id,
            user,
            kinds,
            start_before,
            limit,
        } => to_json_binary(&query_activity(
            deps,
            collection,
            token_id,
            user,
            kinds,
            start_before,
            limit,
        )?),
    }
}

fn stats_for(deps: Deps, env: &Env, collection: &Addr) -> StdResult<StatsResponse> {
    let stats = STATS.may_load(deps.storage, collection)?.unwrap_or_default();

    let floor_price = LISTINGS_BY_PRICE
        .sub_prefix(collection)
        .keys(deps.storage, None, None, Order::Ascending)
        .next()
        .transpose()?
        .map(|(price, _token)| Uint128::new(price));

    let current_hour = env.block.time.seconds() / 3600;
    let volume_24h = HOURLY_VOLUME
        .prefix(collection)
        .range(
            deps.storage,
            Some(Bound::inclusive(current_hour.saturating_sub(23))),
            None,
            Order::Ascending,
        )
        .try_fold(Uint128::zero(), |acc, item| -> StdResult<Uint128> {
            Ok(acc + item?.1)
        })?;

    Ok(StatsResponse {
        volume: stats.volume,
        volume_24h,
        sales: stats.sales,
        listed: stats.listed,
        floor_price,
        last_sale_price: stats.last_sale_price,
        last_sale_at: stats.last_sale_at,
    })
}

fn collection_response(deps: Deps, env: &Env, address: Addr) -> StdResult<CollectionResponse> {
    let collection = COLLECTIONS
        .may_load(deps.storage, &address)?
        .ok_or_else(|| StdError::not_found(format!("collection {address}")))?;
    let stats = stats_for(deps, env, &address)?;
    Ok(CollectionResponse {
        address,
        collection,
        stats,
    })
}

fn query_collections(
    deps: Deps,
    env: &Env,
    start_after: Option<String>,
    limit: Option<u32>,
) -> StdResult<CollectionsResponse> {
    let limit = limit_or_default(limit, MAX_COLLECTIONS_LIMIT);
    let start = start_after
        .map(|a| deps.api.addr_validate(&a))
        .transpose()?;
    let collections = COLLECTIONS
        .range(
            deps.storage,
            start.as_ref().map(Bound::exclusive),
            None,
            Order::Ascending,
        )
        .take(limit)
        .map(|item| {
            let (address, collection) = item?;
            let stats = stats_for(deps, env, &address)?;
            Ok(CollectionResponse {
                address,
                collection,
                stats,
            })
        })
        .collect::<StdResult<Vec<_>>>()?;
    Ok(CollectionsResponse { collections })
}

fn load_listings(deps: Deps, collection: &Addr, token_ids: Vec<String>) -> StdResult<Vec<Listing>> {
    token_ids
        .iter()
        .map(|t| LISTINGS.load(deps.storage, (collection, t)))
        .collect()
}

fn query_listings(
    deps: Deps,
    collection: String,
    sort: ListingSort,
    start_after: Option<ListingCursor>,
    limit: Option<u32>,
) -> StdResult<ListingsResponse> {
    let collection = deps.api.addr_validate(&collection)?;
    let limit = limit_or_default(limit, MAX_LIMIT);

    let token_ids: Vec<String> = match sort {
        ListingSort::PriceAsc | ListingSort::PriceDesc => {
            let order = if matches!(sort, ListingSort::PriceAsc) {
                Order::Ascending
            } else {
                Order::Descending
            };
            let cursor = start_after.map(|c| (c.price.u128(), c.token_id));
            let bound = cursor
                .as_ref()
                .map(|(price, token)| Bound::exclusive((*price, token.as_str())));
            let (min, max) = match order {
                Order::Ascending => (bound, None),
                Order::Descending => (None, bound),
            };
            LISTINGS_BY_PRICE
                .sub_prefix(&collection)
                .keys(deps.storage, min, max, order)
                .take(limit)
                .map(|k| k.map(|(_price, token)| token))
                .collect::<StdResult<_>>()?
        }
        ListingSort::Newest | ListingSort::Oldest => {
            let order = if matches!(sort, ListingSort::Oldest) {
                Order::Ascending
            } else {
                Order::Descending
            };
            let bound = start_after.map(|c| Bound::exclusive(c.seq));
            let (min, max) = match order {
                Order::Ascending => (bound, None),
                Order::Descending => (None, bound),
            };
            LISTINGS_BY_SEQ
                .prefix(&collection)
                .range(deps.storage, min, max, order)
                .take(limit)
                .map(|item| item.map(|(_seq, token)| token))
                .collect::<StdResult<_>>()?
        }
    };

    Ok(ListingsResponse {
        listings: load_listings(deps, &collection, token_ids)?,
    })
}

fn query_listings_by_seller(
    deps: Deps,
    seller: String,
    start_after: Option<ListingKey>,
    limit: Option<u32>,
) -> StdResult<ListingsResponse> {
    let seller = deps.api.addr_validate(&seller)?;
    let limit = limit_or_default(limit, MAX_LIMIT);
    let start = start_after
        .map(|k| -> StdResult<_> { Ok((deps.api.addr_validate(&k.collection)?, k.token_id)) })
        .transpose()?;
    let keys = LISTINGS_BY_SELLER
        .sub_prefix(&seller)
        .keys(
            deps.storage,
            start
                .as_ref()
                .map(|(c, t)| Bound::exclusive((c, t.as_str()))),
            None,
            Order::Ascending,
        )
        .take(limit)
        .collect::<StdResult<Vec<(Addr, String)>>>()?;
    let listings = keys
        .iter()
        .map(|(c, t)| LISTINGS.load(deps.storage, (c, t)))
        .collect::<StdResult<_>>()?;
    Ok(ListingsResponse { listings })
}

fn query_bids_for_token(
    deps: Deps,
    collection: String,
    token_id: String,
    limit: Option<u32>,
) -> StdResult<BidsResponse> {
    let collection = deps.api.addr_validate(&collection)?;
    let limit = limit_or_default(limit, MAX_LIMIT);
    let ids = BIDS_BY_TOKEN
        .sub_prefix((&collection, &token_id))
        .keys(deps.storage, None, None, Order::Descending)
        .take(limit)
        .map(|k| k.map(|(_amount, id)| id))
        .collect::<StdResult<Vec<u64>>>()?;
    Ok(BidsResponse {
        bids: load_bids(deps, ids)?,
    })
}

fn query_bids_by_bidder(
    deps: Deps,
    bidder: String,
    start_before: Option<u64>,
    limit: Option<u32>,
) -> StdResult<BidsResponse> {
    let bidder = deps.api.addr_validate(&bidder)?;
    let limit = limit_or_default(limit, MAX_LIMIT);
    let ids = BIDS_BY_BIDDER
        .prefix(&bidder)
        .keys(
            deps.storage,
            None,
            start_before.map(Bound::exclusive),
            Order::Descending,
        )
        .take(limit)
        .collect::<StdResult<Vec<u64>>>()?;
    Ok(BidsResponse {
        bids: load_bids(deps, ids)?,
    })
}

fn load_bids(deps: Deps, ids: Vec<u64>) -> StdResult<Vec<Bid>> {
    ids.into_iter().map(|id| BIDS.load(deps.storage, id)).collect()
}

fn query_activity(
    deps: Deps,
    collection: Option<String>,
    token_id: Option<String>,
    user: Option<String>,
    kinds: Option<Vec<ActivityKind>>,
    start_before: Option<u64>,
    limit: Option<u32>,
) -> StdResult<ActivityResponse> {
    let limit = limit_or_default(limit, MAX_LIMIT);
    let collection = collection.map(|c| deps.api.addr_validate(&c)).transpose()?;
    let user = user.map(|u| deps.api.addr_validate(&u)).transpose()?;
    if token_id.is_some() && collection.is_none() {
        return Err(StdError::generic_err("token_id filter requires a collection"));
    }
    let max = start_before.map(Bound::exclusive);

    // Walk the most specific index; check the remaining filters per entry.
    let ids: Box<dyn Iterator<Item = StdResult<u64>>> = match (&collection, &token_id, &user) {
        (Some(c), Some(t), _) => Box::new(ACTIVITY_BY_TOKEN.prefix((c, t.as_str())).keys(
            deps.storage,
            None,
            max,
            Order::Descending,
        )),
        (_, _, Some(u)) => Box::new(ACTIVITY_BY_USER.prefix(u).keys(
            deps.storage,
            None,
            max,
            Order::Descending,
        )),
        (Some(c), None, None) => Box::new(ACTIVITY_BY_COLLECTION.prefix(c).keys(
            deps.storage,
            None,
            max,
            Order::Descending,
        )),
        (None, _, None) => Box::new(ACTIVITY.keys(deps.storage, None, max, Order::Descending)),
    };

    let mut activity = Vec::with_capacity(limit);
    let mut scanned = 0usize;
    let mut last_id = None;
    for id in ids {
        let id = id?;
        scanned += 1;
        last_id = Some(id);
        let entry = ACTIVITY.load(deps.storage, id)?;
        let matches = collection.as_ref().map_or(true, |c| entry.collection == *c)
            && token_id.as_ref().map_or(true, |t| &entry.token_id == t)
            && user.as_ref().map_or(true, |u| {
                entry.actor == *u || entry.counterparty.as_ref() == Some(u)
            })
            && kinds.as_ref().map_or(true, |k| k.contains(&entry.kind));
        if matches {
            activity.push(entry);
        }
        if activity.len() >= limit || scanned >= MAX_ACTIVITY_SCAN {
            break;
        }
    }

    // If we stopped early there may be more; let the caller continue from the last id seen.
    let stopped_early = activity.len() >= limit || scanned >= MAX_ACTIVITY_SCAN;
    let next = match (stopped_early, last_id) {
        (true, Some(id)) if id > 1 => Some(id),
        _ => None,
    };
    Ok(ActivityResponse { activity, next })
}
