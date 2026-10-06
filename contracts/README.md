# Contracts

| Crate | Wasm | Purpose |
|---|---|---|
| `marketplace` | `cousins_marketplace.wasm` | The marketplace (see `src/msg.rs` for every message; JSON schema in `marketplace/schema/`). |
| `cousins-nft` | `cousins_nft.wasm` | cw721 with on-chain metadata (cw-nfts `cw721-metadata-onchain` v0.20), the test collection. |

## Test

```sh
cargo test
cargo clippy --all-targets
```

The marketplace tests run against the real cw721 contract in cw-multi-test.

## Build Wasm for Terra

Terra (phoenix-1) runs wasmvm 2.2, which only accepts Wasm without reference-types or bulk-memory. Rust 1.82 and newer turn reference-types on, so build with **Rust 1.81**:

```sh
rustup toolchain install 1.81.0 --target wasm32-unknown-unknown
RUSTFLAGS="-C link-arg=-s" cargo +1.81.0 build --locked --release --lib \
  --target wasm32-unknown-unknown -p cousins-marketplace -p cousins-nft

mkdir -p artifacts
for name in cousins_marketplace cousins_nft; do
  wasm-opt -Os --strip-debug --strip-producers \
    --mvp-features --enable-sign-ext --enable-mutable-globals \
    --enable-nontrapping-float-to-int --enable-multivalue \
    target/wasm32-unknown-unknown/release/$name.wasm -o artifacts/$name.wasm
done

cosmwasm-check --available-capabilities \
  iterator,staking,stargate,cosmwasm_1_1,cosmwasm_1_2,cosmwasm_1_3,cosmwasm_1_4,token_factory \
  artifacts/*.wasm
```

`wasm-opt` comes from binaryen (`npm i -g binaryen`). `cosmwasm-check` is installed with `cargo install cosmwasm-check --version "~2.2"`, using any recent Rust.

The **Contracts** GitHub Action does all of this on every push and uploads the result as the `contracts-wasm` artifact.

Don't upgrade these until Terra enables CosmWasm 3:
- `cosmwasm-std`: stay on 2.2.x.
- `cw721`: stay on 0.20.x.
- The `cosmwasm/optimizer` image: 0.17+ produces Wasm that needs CosmWasm 3.

## Messages at a glance

```jsonc
// List: on the NFT contract
{ "send_nft": { "contract": "<marketplace>", "token_id": "1",
                "msg": base64({ "list": { "price": "5000000" } }) } }

// Marketplace
{ "buy":            { "collection": "...", "token_id": "1" } }       // funds = price
{ "update_price":   { "collection": "...", "token_id": "1", "price": "4000000" } }
{ "cancel_listing": { "collection": "...", "token_id": "1" } }
{ "place_bid":      { "collection": "...", "token_id": "1" } }       // funds = bid
{ "cancel_bid":     { "bid_id": 7 } }
{ "accept_bid":     { "bid_id": 7 } }                                // NFT listed by you
// or, NFT not listed: send_nft with msg base64({ "accept_bid": { "bid_id": 7 } })

// Admin
{ "set_collection": { "address": "...", "collection": { "name": "...", "royalty_bps": 450,
                      "royalty_recipient": "terra1...", "enabled": true, ... } } }
{ "update_config":  { "fee_bps": 250, "paused": false } }
```

The queries are `config`, `collection`, `collections`, `stats`, `listing`, `listings` (sorted by price or time, paginated), `listings_by_seller`, `bid`, `bids_for_token`, `bids_by_bidder` and `activity` (filter by collection, token, user and kind).
