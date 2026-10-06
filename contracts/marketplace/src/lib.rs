//! Cousins Island NFT marketplace for Terra (phoenix-1).
//!
//! - **Listings are escrowed.** Sellers `send_nft` to this contract with
//!   `{"list":{"price":"..."}}`; the NFT stays here until it's sold or the
//!   listing is cancelled, so a listing can never point at an NFT the seller
//!   no longer owns.
//! - **Bids are escrowed.** Bidders attach the funds when placing a bid and
//!   get them back on cancel. No deposit/withdraw balance to manage.
//! - **One denom** (normally `uluna`) for prices and bids.
//! - **Stats and history on chain**: volume, 24h volume, floor price, sales
//!   count and a filterable activity log, so the frontend needs no indexer.

pub mod contract;
pub mod error;
pub mod msg;
pub mod query;
pub mod state;

pub use crate::error::ContractError;

#[cfg(test)]
mod tests;
