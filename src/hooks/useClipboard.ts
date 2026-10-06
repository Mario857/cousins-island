import { useCallback, useEffect, useState } from 'react'

interface UseClipboardOptions {
	/** How long (ms) `isCopied` stays true after copying. */
	successDuration?: number
}

const DEFAULT_SUCCESS_DURATION = 2000

// Fallback for browsers/contexts without the async Clipboard API (e.g. plain http).
const copyWithTextarea = (text: string) => {
	const textarea = document.createElement('textarea')
	textarea.value = text
	textarea.setAttribute('readonly', '')
	textarea.style.position = 'fixed'
	textarea.style.opacity = '0'
	document.body.appendChild(textarea)
	textarea.select()

	try {
		return document.execCommand('copy')
	} finally {
		document.body.removeChild(textarea)
	}
}

/** Drop-in replacement for `react-use-clipboard`: returns `[isCopied, setCopied]`. */
export default function useClipboard(
	text: string,
	options?: UseClipboardOptions,
): [boolean, () => void] {
	const [isCopied, setIsCopied] = useState(false)
	const successDuration = options?.successDuration ?? DEFAULT_SUCCESS_DURATION

	useEffect(() => {
		if (!isCopied) return

		const timeout = setTimeout(() => setIsCopied(false), successDuration)

		return () => clearTimeout(timeout)
	}, [isCopied, successDuration])

	const setCopied = useCallback(() => {
		if (navigator.clipboard?.writeText) {
			navigator.clipboard
				.writeText(text)
				.then(() => setIsCopied(true))
				.catch(() => setIsCopied(copyWithTextarea(text)))
		} else {
			setIsCopied(copyWithTextarea(text))
		}
	}, [text])

	return [isCopied, setCopied]
}
