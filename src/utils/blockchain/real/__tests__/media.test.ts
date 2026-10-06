import { describe, expect, it } from 'vitest'
import {
	DEFAULT_IPFS_GATEWAY,
	FALLBACK_IPFS_GATEWAY,
	imageDataToUrl,
	isVideoUrl,
	resolveUri,
	toFallbackGateway,
} from '../media'

const GW = 'https://gw.example/ipfs/'

describe('resolveUri', () => {
	it('resolves ipfs:// URIs through the gateway', () => {
		expect(resolveUri('ipfs://QmHash/1.png', GW)).toBe('https://gw.example/ipfs/QmHash/1.png')
		expect(resolveUri('ipfs://ipfs/QmHash', GW)).toBe('https://gw.example/ipfs/QmHash')
		expect(resolveUri('/ipfs/QmHash', GW)).toBe('https://gw.example/ipfs/QmHash')
	})

	it('adds a missing trailing slash to the gateway', () => {
		expect(resolveUri('ipfs://Qm', 'https://gw.example/ipfs')).toBe('https://gw.example/ipfs/Qm')
	})

	it('uses ipfs.io by default', () => {
		expect(resolveUri('ipfs://Qm')).toBe(`${DEFAULT_IPFS_GATEWAY}Qm`)
	})

	it('resolves arweave and keeps http/data URLs', () => {
		expect(resolveUri('ar://abc', GW)).toBe('https://arweave.net/abc')
		expect(resolveUri('https://x.y/z.png', GW)).toBe('https://x.y/z.png')
		expect(resolveUri('data:image/png;base64,AAA', GW)).toBe('data:image/png;base64,AAA')
	})

	it('handles empty values', () => {
		expect(resolveUri(undefined)).toBe('')
		expect(resolveUri(null)).toBe('')
		expect(resolveUri('   ')).toBe('')
	})
})

describe('toFallbackGateway', () => {
	it('rewrites primary gateway URLs to dweb.link', () => {
		expect(toFallbackGateway('https://gw.example/ipfs/Qm/1.json', GW)).toBe(`${FALLBACK_IPFS_GATEWAY}Qm/1.json`)
		expect(toFallbackGateway('https://other.example/1.json', GW)).toBeNull()
	})
})

describe('imageDataToUrl', () => {
	it('turns raw SVG into a data URL', () => {
		const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>'
		const url = imageDataToUrl(svg)
		expect(url.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
		expect(decodeURIComponent(url.split(',').slice(1).join(','))).toBe(svg)
	})

	it('keeps data URLs and treats other content as base64 SVG', () => {
		expect(imageDataToUrl('data:image/svg+xml;base64,AAA')).toBe('data:image/svg+xml;base64,AAA')
		expect(imageDataToUrl('PHN2Zz48L3N2Zz4=')).toBe('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=')
		expect(imageDataToUrl('')).toBe('')
		expect(imageDataToUrl(null)).toBe('')
	})
})

describe('isVideoUrl', () => {
	it('detects video files', () => {
		expect(isVideoUrl('https://x/a.mp4')).toBe(true)
		expect(isVideoUrl('https://x/a.webm?x=1')).toBe(true)
		expect(isVideoUrl('https://x/a.png')).toBe(false)
		expect(isVideoUrl('')).toBe(false)
	})
})
