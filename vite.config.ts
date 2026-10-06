/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { fileURLToPath } from 'node:url'

const src = fileURLToPath(new URL('./src', import.meta.url))

// The app imports from src/ without a leading "./" (e.g. `components/Button/Button`).
const srcFolders = ['components', 'config', 'constants', 'hooks', 'pages', 'store', 'theme', 'utils', 'wallet']

export default defineConfig({
	plugins: [
		// Keeps CRA-style `import { ReactComponent as Icon } from './icon.svg'` working.
		svgr({ include: '**/*.svg', svgrOptions: { exportType: 'named', namedExport: 'ReactComponent' } }),
		react(),
	],
	resolve: {
		alias: [
			{ find: /^wallet$/, replacement: `${src}/wallet/index.ts` },
			{ find: new RegExp(`^(${srcFolders.join('|')})/`), replacement: `${src}/$1/` },
		],
	},
	server: { port: 3000 },
	build: {
		outDir: 'build',
		chunkSizeWarningLimit: 1500,
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
	},
})
