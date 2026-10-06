// Keplr's documented universal link that opens a URL in the Keplr mobile app's
// built-in browser: https://docs.keplr.app/api/mobile/deeplink
const KEPLR_DEEPLINK_BASE = 'https://deeplink.keplr.app/web-browser?url='

export function getKeplrMobileDeepLink(url: string): string {
	return KEPLR_DEEPLINK_BASE + encodeURIComponent(url)
}

export function isMobileDevice(userAgent: string = typeof navigator === 'undefined' ? '' : navigator.userAgent): boolean {
	return /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(userAgent)
}
