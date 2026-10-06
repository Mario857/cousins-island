/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_DEFAULT_NETWORK?: 'phoenix-1' | 'pisco-1'
	readonly VITE_MARKETPLACE_ADDRESS?: string
	readonly VITE_PISCO_MARKETPLACE_ADDRESS?: string
	readonly VITE_PHOENIX_RPC?: string
	readonly VITE_PHOENIX_REST?: string
	readonly VITE_PISCO_RPC?: string
	readonly VITE_PISCO_REST?: string
	readonly VITE_IPFS_GATEWAY?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare module '*.svg' {
	import * as React from 'react'
	export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>
	const src: string
	export default src
}
