import type { AxiosError } from 'axios'

function flattenLaravelErrors(errors: Record<string, unknown>): string[] {
	const out: string[] = []
	for (const v of Object.values(errors)) {
		if (Array.isArray(v)) {
			for (const item of v) {
				if (typeof item === 'string') out.push(item)
			}
		} else if (typeof v === 'string') {
			out.push(v)
		}
	}
	return out
}

export function getAxiosErrorMessage(err: unknown, fallback: string): string {
	if (err && typeof err === 'object' && 'isAxiosError' in err && (err as AxiosError).isAxiosError) {
		const ax = err as AxiosError<{ message?: unknown; errors?: Record<string, unknown> }>
		const data = ax.response?.data
		if (data && typeof data === 'object') {
			if (data.errors && typeof data.errors === 'object') {
				const parts = flattenLaravelErrors(data.errors as Record<string, unknown>)
				if (parts.length) return parts.join(' ')
			}
			const msg = data.message
			if (typeof msg === 'string' && msg.trim()) return msg
		}
		if (typeof ax.message === 'string' && ax.message) return ax.message
	}
	if (err instanceof Error && err.message) return err.message
	return fallback
}
