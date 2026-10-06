# Cousins Island

NFT marketplace on **Terra** (phoenix-1), revived in 2026.

The original app (2022–23) ran on Terra Classic with Terraform Labs' wallet libraries and Luart's hosted APIs, all of which are now gone. This version runs on today's Terra chain with its own marketplace contract, and needs no backend.

| Part | What it is |
|---|---|
| `contracts/marketplace` | CosmWasm marketplace: escrowed listings and bids in LUNA, creator royalties, marketplace fee, pause switch, and on-chain stats and activity history. |
| `contracts/cousins-nft` | Standard cw721 collection with on-chain metadata (cw-nfts v0.20), used as the test collection. |
| `src/` | React 19 + Vite web app. It reads everything straight from chain through public Terra RPC nodes. |
| `scripts/deploy.ts` | Uploads the contracts, creates the marketplace and a test collection, and mints sample NFTs. |

## How trading works

- **Listing:** the owner sends the NFT to the marketplace with a price, and the contract holds it until it's sold or the listing is cancelled. The fee and royalty in force at that moment are locked into the listing.
- **Buying:** pay the exact listed price in LUNA. In one transaction the buyer gets the NFT, the seller gets the price minus fees, the fee recipient gets the marketplace fee, and the creator gets the royalty.
- **Bidding:** anyone can bid on any registered NFT, listed or not. The LUNA is held by the contract until the bid is accepted or cancelled. There's no deposit or withdraw step.
- **Accepting a bid:** the seller accepts, whether or not the NFT is listed.
- **Admin:** the admin registers collections, sets the fee (max 10%) and royalties (max 15%), and can pause trading. Cancelling a listing or bid always works, even while paused. The admin can cancel on someone's behalf, but the NFT or funds always go back to their owner.

## Run the app

Needs Node 20.19+ (24 recommended).

```sh
npm install
npm run dev          # http://localhost:3000
```

Other commands:

- `npm run build` writes the static site to `build/`. It can be hosted anywhere (Vercel, Netlify, Cloudflare Pages, GitHub Pages); configure the host to serve `index.html` for unknown paths.
- `npm test` runs the unit tests.
- `npm run typecheck` runs the TypeScript checks.

Until a marketplace is deployed, the site loads but shows empty collections.

### Choosing a network

- Mainnet (phoenix-1) is the default.
- Add `?use-testnet` to the URL to switch to pisco-1, and `?use-mainnet` to switch back. The choice is remembered.
- You can also set `VITE_DEFAULT_NETWORK` (see `.env.example` for all settings).

### Wallets

The app supports Keplr and Cosmostation browser extensions; on phones it opens the site inside Keplr Mobile.

Terra Station is not supported: Terraform Labs shut it down in 2024. Leap is not supported either: it shut down in 2026.

## Deploy the contracts

1. **Get the `.wasm` files.**
   - Easiest: open the latest **Contracts** run under the repo's *Actions* tab, download the `contracts-wasm` artifact, and unzip it into `contracts/artifacts/`.
   - Or build them yourself (see `contracts/README.md`).
2. **Create a deployer wallet and fund it.** It becomes the marketplace admin.
   - Testnet: get LUNA from https://faucet.terra.money. Testnet infrastructure has been unreliable since Terraform Labs wound down, so you may need to test on mainnet with small amounts.
   - Mainnet: about 10 LUNA covers gas.
3. **Configure and run:**
   ```sh
   cp .env.example .env     # set MNEMONIC (and NETWORK=phoenix-1 for mainnet)
   npm run deploy:contracts
   ```
   This uploads both contracts, creates the marketplace (2.5% fee) and a test collection with a 4.5% royalty, then mints 12 test NFTs to the deployer. The addresses are saved to `src/config/deployments.json`.
4. **Commit `deployments.json`** and redeploy the site.

Other commands:

```sh
# List an existing cw721 collection on the marketplace
npm run deploy:contracts -- register --address terra1... --name "My Collection" \
  --royalty-bps 500 --royalty-recipient terra1... --image ipfs://...

# Mint more test NFTs
npm run deploy:contracts -- mint --count 6
```

### Before going live on mainnet

- **Admin key:** the deployer key is the marketplace admin and also the contract's migration admin. Whoever holds it can upgrade the contract code, and with it, reach every escrowed NFT and bid. Move both roles to a multisig before real users trade (`update_config { admin }`, plus `MsgUpdateAdmin` for migration rights).
- **Approved operators:** an approved operator (cw721 `approve_all`) who lists someone else's NFT is treated as the seller and receives the proceeds. That is standard cw721 behaviour, but worth knowing.
- **Audit:** the contract has 24 integration tests and has had an internal review, but no external audit.

## Project layout

```
contracts/          Rust workspace (marketplace, cousins-nft), schema, CI builds Wasm on Rust 1.81
scripts/deploy.ts   deploy / register / mint
src/config/         networks (RPC fallbacks, explorers), contract addresses
src/wallet/         Keplr/Cosmostation connection
src/utils/blockchain/real/   chain reads, transactions, data mapping (+ tests)
```

### Why Rust 1.81

Terra runs CosmWasm with wasmvm 2.2, which rejects Wasm that uses reference-types. Rust 1.82 and newer emit reference-types by default, so the contracts must be compiled with Rust 1.81 (CI enforces this).
