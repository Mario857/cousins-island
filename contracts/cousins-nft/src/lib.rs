//! Test NFT collection for Cousins Island.
//!
//! This is the standard `cw721-metadata-onchain` contract (cw-nfts v0.20.0) with
//! its entry points exported, so it can be built with the same optimizer and
//! toolchain as the marketplace. Token metadata (name, image, attributes) is
//! stored on chain, which is what the frontend reads.

pub use cw721_metadata_onchain::msg::{ExecuteMsg, InstantiateMsg, MigrateMsg, QueryMsg};

pub mod entry {
    #[cfg(not(feature = "library"))]
    use cosmwasm_std::entry_point;
    use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response};
    use cw721_metadata_onchain::{
        entry as base,
        error::ContractError,
        msg::{ExecuteMsg, InstantiateMsg, MigrateMsg, QueryMsg},
    };

    #[cfg_attr(not(feature = "library"), entry_point)]
    pub fn instantiate(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: InstantiateMsg,
    ) -> Result<Response, ContractError> {
        base::instantiate(deps, env, info, msg)
    }

    #[cfg_attr(not(feature = "library"), entry_point)]
    pub fn execute(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: ExecuteMsg,
    ) -> Result<Response, ContractError> {
        base::execute(deps, env, info, msg)
    }

    #[cfg_attr(not(feature = "library"), entry_point)]
    pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> Result<Binary, ContractError> {
        base::query(deps, env, msg)
    }

    #[cfg_attr(not(feature = "library"), entry_point)]
    pub fn migrate(deps: DepsMut, env: Env, msg: MigrateMsg) -> Result<Response, ContractError> {
        base::migrate(deps, env, msg)
    }
}
