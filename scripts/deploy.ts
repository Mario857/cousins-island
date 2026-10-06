/**
 * Deploy Cousins Island contracts to Terra.
 *
 *   npm run deploy:contracts -- deploy   [--network pisco-1|phoenix-1] [--mint 12] [--skip-collection]
 *   npm run deploy:contracts -- register --address terra1... --name "My NFTs" [--royalty-bps 500 --royalty-recipient terra1...]
 *   npm run deploy:contracts -- mint     [--count 6]
 *
 * Settings come from the environment (or a .env file next to package.json):
 *   MNEMONIC          deployer wallet (required). Becomes marketplace admin and test-collection minter.
 *   NETWORK           pisco-1 (default) or phoenix-1. --network overrides it.
 *   RPC               RPC endpoint override.
 *   FEE_BPS           marketplace fee in basis points (default 250 = 2.5%).
 *   FEE_RECIPIENT     who receives the fee (default: deployer).
 *   WASM_DIR          folder with the .wasm files (default contracts/artifacts).
 *
 * Addresses are written to src/config/deployments.json, which the frontend reads.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { SigningCosmWasmClient, type ExecuteInstruction } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { GasPrice } from '@cosmjs/stargate'
import { stringToPath } from '@cosmjs/crypto'

type NetworkId = 'phoenix-1' | 'pisco-1'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DEPLOYMENTS_FILE = path.join(ROOT, 'src/config/deployments.json')

const DEFAULT_RPC: Record<NetworkId, string[]> = {
	'phoenix-1': ['https://terra-rpc.publicnode.com:443', 'https://rpc-phoenix.keplr.app', 'https://terra-rpc.polkachu.com:443'],
	'pisco-1': ['https://terra-testnet-rpc.polkachu.com:443', 'https://pisco-rpc.terra.dev'],
}
const EXPLORER_TX: Record<NetworkId, (hash: string) => string> = {
	'phoenix-1': h => `https://terra.valopers.com/transactions/${h}`,
	'pisco-1': h => `https://terrasco.pe/testnet/tx/${h}`,
}

// ---------------------------------------------------------------------------

const { positionals, values: args } = parseArgs({
	allowPositionals: true,
	options: {
		network: { type: 'string' },
		mint: { type: 'string', default: '12' },
		count: { type: 'string', default: '6' },
		'skip-collection': { type: 'boolean', default: false },
		address: { type: 'string' },
		name: { type: 'string' },
		description: { type: 'string' },
		image: { type: 'string' },
		banner: { type: 'string' },
		website: { type: 'string' },
		twitter: { type: 'string' },
		discord: { type: 'string' },
		'royalty-bps': { type: 'string', default: '0' },
		'royalty-recipient': { type: 'string' },
		disable: { type: 'boolean', default: false },
		yes: { type: 'boolean', short: 'y', default: false },
	},
})
const command = positionals[0] ?? 'deploy'

const network = (args.network ?? process.env.NETWORK ?? 'pisco-1') as NetworkId
if (network !== 'pisco-1' && network !== 'phoenix-1') fail(`Unknown network "${network}"`)

function fail(message: string): never {
	console.error(`\n✖ ${message}\n`)
	process.exit(1)
}

function log(message: string) {
	console.log(message)
}

// ---------------------------------------------------------------------------

interface Deployment {
	marketplace: string
	collections: string[]
	marketplaceCodeId?: number
	nftCodeId?: number
	admin?: string
	deployedAt?: string
}

async function readDeployments(): Promise<Record<NetworkId, Deployment>> {
	return JSON.parse(await readFile(DEPLOYMENTS_FILE, 'utf8'))
}

async function saveDeployment(update: Partial<Deployment>) {
	const all = await readDeployments()
	all[network] = { ...all[network], ...update }
	await writeFile(DEPLOYMENTS_FILE, JSON.stringify(all, null, '\t') + '\n')
	log(`  saved → src/config/deployments.json`)
}

async function connect() {
	const mnemonic = process.env.MNEMONIC?.trim()
	if (!mnemonic) fail('Set MNEMONIC (in .env or the environment) to the deployer wallet’s seed phrase.')
	// Terra uses coin type 330 (Keplr, Station and Cosmostation all derive this path).
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix: 'terra',
		hdPaths: [stringToPath("m/44'/330'/0'/0/0")],
	})
	const [{ address }] = await wallet.getAccounts()
	const endpoints = process.env.RPC ? [process.env.RPC] : DEFAULT_RPC[network]
	let lastError: unknown
	for (const rpc of endpoints) {
		try {
			const client = await SigningCosmWasmClient.connectWithSigner(rpc, wallet, {
				gasPrice: GasPrice.fromString('0.015uluna'),
			})
			const chainId = await client.getChainId()
			if (chainId !== network) fail(`${rpc} is ${chainId}, expected ${network}`)
			const balance = await client.getBalance(address, 'uluna')
			log(`Network  ${network} via ${rpc}`)
			log(`Deployer ${address}  (${(Number(balance.amount) / 1e6).toFixed(3)} LUNA)`)
			if (balance.amount === '0') {
				fail(
					network === 'pisco-1'
						? 'The deployer has no testnet LUNA. Get some from https://faucet.terra.money and retry.'
						: 'The deployer has no LUNA. Send ~10 LUNA to it for gas and retry.'
				)
			}
			return { client, address }
		} catch (e) {
			lastError = e
			log(`  ${rpc} unavailable, trying next…`)
		}
	}
	fail(`Could not reach any RPC for ${network}: ${lastError instanceof Error ? lastError.message : lastError}`)
}

async function readWasm(name: string): Promise<Uint8Array> {
	const dir = path.resolve(ROOT, process.env.WASM_DIR ?? 'contracts/artifacts')
	const file = path.join(dir, name)
	if (!existsSync(file)) {
		fail(
			`${file} not found.\n  Build it with the optimizer (see contracts/README.md), or download the\n  "contracts-wasm" artifact from the latest "Contracts" GitHub Actions run into contracts/artifacts/.`
		)
	}
	return new Uint8Array(await readFile(file))
}

async function upload(client: SigningCosmWasmClient, sender: string, file: string): Promise<number> {
	log(`  uploading ${file}…`)
	const result = await client.upload(sender, await readWasm(file), 'auto', `Cousins Island ${file}`)
	log(`  code id ${result.codeId}  ${EXPLORER_TX[network](result.transactionHash)}`)
	return result.codeId
}

// ---------------------------------------------------------------------------
// Test NFT artwork: small SVG islands stored on chain (cw721 `image_data`).

const SKIES = [
	['Dawn', '#FDE68A', '#FCA5A5'],
	['Noon', '#BAE6FD', '#E0F2FE'],
	['Dusk', '#C4B5FD', '#F9A8D4'],
	['Night', '#1E1B4B', '#312E81'],
] as const
const SEAS = [
	['Lagoon', '#2DD4BF'],
	['Deep', '#1D4ED8'],
	['Emerald', '#059669'],
] as const
const PALMS = ['None', 'Single', 'Twin'] as const
const SUNS = ['Sun', 'Moon', 'Eclipse'] as const

function pick<T>(items: readonly T[], seed: number, salt: number): T {
	return items[(seed * 7 + salt * 13 + ((seed * salt) % 5)) % items.length]
}

function testToken(n: number) {
	const [skyName, skyTop, skyBottom] = pick(SKIES, n, 1)
	const [seaName, sea] = pick(SEAS, n, 2)
	const palms = pick(PALMS, n, 3)
	const sun = pick(SUNS, n, 4)
	const sunColor = sun === 'Moon' ? '#F8FAFC' : sun === 'Eclipse' ? '#0F172A' : '#FBBF24'
	const palm = (x: number) =>
		`<path d="M${x} 150q4-30 0-52" stroke="#78350F" stroke-width="5" fill="none"/><path d="M${x} 98q-22-6-34 6M${x} 98q20-10 34 0M${x} 98q-6-18-22-22M${x} 98q10-18 26-18" stroke="#15803D" stroke-width="6" stroke-linecap="round" fill="none"/>`
	const svg = [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">`,
		`<defs><linearGradient id="s" x2="0" y2="1"><stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBottom}"/></linearGradient></defs>`,
		`<rect width="240" height="240" fill="url(#s)"/>`,
		`<circle cx="182" cy="56" r="22" fill="${sunColor}"${sun === 'Eclipse' ? ' stroke="#FBBF24" stroke-width="4"' : ''}/>`,
		`<rect y="160" width="240" height="80" fill="${sea}"/>`,
		`<ellipse cx="120" cy="162" rx="70" ry="16" fill="#FCD34D"/>`,
		palms === 'Single' ? palm(118) : palms === 'Twin' ? palm(96) + palm(146) : '',
		`<text x="12" y="228" font-family="sans-serif" font-size="14" font-weight="700" fill="#fff" fill-opacity=".85">#${n}</text>`,
		`</svg>`,
	].join('')
	return {
		token_id: String(n),
		extension: {
			name: `Cousin Island #${n}`,
			description: 'Test NFT minted by the Cousins Island deploy script.',
			image_data: svg,
			attributes: [
				{ trait_type: 'Sky', value: skyName },
				{ trait_type: 'Sea', value: seaName },
				{ trait_type: 'Palms', value: palms },
				{ trait_type: 'Light', value: sun },
			],
		},
	}
}

async function mintTestTokens(client: SigningCosmWasmClient, sender: string, nft: string, from: number, count: number) {
	const BATCH = 6
	for (let start = from; start < from + count; start += BATCH) {
		const ids = Array.from({ length: Math.min(BATCH, from + count - start) }, (_, i) => start + i)
		const instructions: ExecuteInstruction[] = ids.map(n => {
			const t = testToken(n)
			return { contractAddress: nft, msg: { mint: { token_id: t.token_id, owner: sender, token_uri: null, extension: t.extension } } }
		})
		const result = await client.executeMultiple(sender, instructions, 'auto')
		log(`  minted #${ids[0]}–#${ids[ids.length - 1]}  ${EXPLORER_TX[network](result.transactionHash)}`)
	}
}

// ---------------------------------------------------------------------------

async function deploy() {
	const { client, address } = await connect()
	const existing = (await readDeployments())[network]
	if (existing.marketplace && !args.yes) {
		fail(`deployments.json already has a ${network} marketplace (${existing.marketplace}).\n  Pass --yes to deploy a new one and replace it.`)
	}

	log('\n1. Marketplace')
	const marketplaceCodeId = await upload(client, address, 'cousins_marketplace.wasm')
	const feeBps = Number(process.env.FEE_BPS ?? 250)
	const { contractAddress: marketplace } = await client.instantiate(
		address,
		marketplaceCodeId,
		{ admin: address, fee_bps: feeBps, fee_recipient: process.env.FEE_RECIPIENT || address, denom: 'uluna' },
		'Cousins Island marketplace',
		'auto',
		{ admin: address } // can migrate later
	)
	log(`  marketplace ${marketplace}  (fee ${feeBps / 100}%)`)
	await saveDeployment({
		marketplace,
		marketplaceCodeId,
		admin: address,
		collections: [],
		deployedAt: new Date().toISOString(),
	})

	if (args['skip-collection']) return done()

	log('\n2. Test collection')
	const nftCodeId = await upload(client, address, 'cousins_nft.wasm')
	const { contractAddress: nft } = await client.instantiate(
		address,
		nftCodeId,
		{ name: 'Cousin Island Test', symbol: 'COUSIN', collection_info_extension: null, minter: address, creator: address, withdraw_address: null },
		'Cousin Island test collection',
		'auto',
		{ admin: address }
	)
	log(`  collection ${nft}`)

	await client.execute(
		address,
		marketplace,
		{
			set_collection: {
				address: nft,
				collection: {
					name: 'Cousin Island Test',
					description: 'Little islands minted on chain to try out the marketplace: list, buy, bid and transfer.',
					image: null,
					banner: null,
					website: null,
					twitter: null,
					discord: null,
					royalty_bps: 450,
					royalty_recipient: address,
					enabled: true,
				},
			},
		},
		'auto'
	)
	log('  registered on the marketplace (4.5% royalty to the deployer)')
	await saveDeployment({ collections: [nft], nftCodeId })

	const mintCount = Number(args.mint)
	if (mintCount > 0) {
		log(`\n3. Minting ${mintCount} test NFTs to the deployer`)
		await mintTestTokens(client, address, nft, 1, mintCount)
	}
	done()
}

async function register() {
	if (!args.address || !args.name) fail('register needs --address and --name')
	const { client, address } = await connect()
	const { marketplace } = (await readDeployments())[network]
	if (!marketplace) fail(`No ${network} marketplace in deployments.json; run deploy first.`)
	const royaltyBps = Number(args['royalty-bps'])
	const result = await client.execute(
		address,
		marketplace,
		{
			set_collection: {
				address: args.address,
				collection: {
					name: args.name,
					description: args.description ?? null,
					image: args.image ?? null,
					banner: args.banner ?? null,
					website: args.website ?? null,
					twitter: args.twitter ?? null,
					discord: args.discord ?? null,
					royalty_bps: royaltyBps,
					royalty_recipient: args['royalty-recipient'] ?? (royaltyBps > 0 ? address : null),
					enabled: !args.disable,
				},
			},
		},
		'auto'
	)
	log(`\nRegistered ${args.name} (${args.address})  ${EXPLORER_TX[network](result.transactionHash)}`)
}

async function mint() {
	const { client, address } = await connect()
	const [nft] = (await readDeployments())[network].collections
	if (!nft) fail(`No test collection for ${network} in deployments.json; run deploy first.`)
	const { count } = await client.queryContractSmart(nft, { num_tokens: {} })
	await mintTestTokens(client, address, nft, Number(count) + 1, Number(args.count))
}

function done() {
	log(`\n✔ Done. Start the app with:  VITE_DEFAULT_NETWORK=${network} npm run dev`)
	log('  Commit src/config/deployments.json so the deployed site uses these addresses.\n')
}

const commands: Record<string, () => Promise<void>> = { deploy, register, mint }
if (!commands[command]) fail(`Unknown command "${command}". Use deploy, register or mint.`)
commands[command]().catch(e => fail(e instanceof Error ? e.message : String(e)))

