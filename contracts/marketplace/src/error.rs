use cosmwasm_std::{OverflowError, StdError, Uint128};
use cw_utils::PaymentError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    Payment(#[from] PaymentError),

    #[error("{0}")]
    Overflow(#[from] OverflowError),

    #[error("Only the admin can do this")]
    Unauthorized,

    #[error("The marketplace is paused")]
    Paused,

    #[error("Collection {0} is not registered on this marketplace")]
    UnknownCollection(String),

    #[error("Collection {0} is disabled")]
    CollectionDisabled(String),

    #[error("Token {token_id} is not listed")]
    NotListed { token_id: String },

    #[error("Only the seller can do this")]
    NotSeller,

    #[error("Price must be greater than zero")]
    ZeroPrice,

    #[error("Send exactly {expected}{denom} (the listing price)")]
    WrongPayment { expected: Uint128, denom: String },

    #[error("You can't buy or bid on your own listing")]
    OwnListing,

    #[error("Bid {0} not found")]
    BidNotFound(u64),

    #[error("Only the bidder can cancel this bid")]
    NotBidder,

    #[error("You already have a bid on this NFT (bid {0}); cancel it first")]
    BidExists(u64),

    #[error("This bid is for a different NFT")]
    BidMismatch,

    #[error("Fee is too high: at most {max} basis points")]
    FeeTooHigh { max: u16 },

    #[error("Royalty recipient is required when royalty is above zero")]
    MissingRoyaltyRecipient,

    #[error("Invalid field {field}: {reason}")]
    InvalidField { field: String, reason: String },

    #[error("token_id filter requires a collection")]
    TokenFilterNeedsCollection,

    #[error("Can't migrate from {previous_contract} {previous_version}")]
    CannotMigrate {
        previous_contract: String,
        previous_version: String,
    },
}
