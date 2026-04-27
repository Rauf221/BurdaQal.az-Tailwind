/** Bəzi cavablarda qalan tərs slashlar və boşluqlar. */
function normalizeIncomingPath(path: string | null | undefined): string {
	if (path == null) return ''
	return String(path).trim().replace(/\\\//g, '/')
}

/**
 * API-dən gələn media yolunu brauzer üçün tam URL-ə çevirir.
 * Nisbətən yollar (/assets/...) API bazasına görə həll olunur (new URL qaydası).
 */
export function resolveMediaUrl(apiBase: string, path: string | null | undefined): string {
	const p = normalizeIncomingPath(path)
	if (!p) return ''
	if (/^https?:\/\//i.test(p)) return p
	if (p.startsWith('data:')) return p
	if (p.startsWith('//')) return `https:${p}`
	const base = (apiBase || '').replace(/\/+$/, '')
	if (!base) {
		return p.startsWith('/') ? p : `/${p}`
	}
	try {
		return new URL(p, `${base}/`).href
	} catch {
		return p
	}
}

export type LooseSiteSettings = {
	logo?: string
	dark_logo?: string
	favicon?: string
}

/** Laravel envelope və ya düz obyekt; bəzən ikiqat `data`. */
export function extractSettingsFromApiPayload(payload: unknown): LooseSiteSettings | null {
	if (!payload || typeof payload !== 'object') return null
	const o = payload as Record<string, unknown>
	const read = (x: Record<string, unknown>): LooseSiteSettings => {
		const darkRaw =
			(typeof x.dark_logo === 'string' && x.dark_logo) || (typeof x.darkLogo === 'string' && x.darkLogo) || ''
		const dark = normalizeIncomingPath(darkRaw) || undefined
		const logo = normalizeIncomingPath(typeof x.logo === 'string' ? x.logo : '') || undefined
		const fav = normalizeIncomingPath(typeof x.favicon === 'string' ? x.favicon : '') || undefined
		return {
			logo,
			dark_logo: dark,
			favicon: fav,
		}
	}
	const top = read(o)
	if (top.logo || top.dark_logo || top.favicon) return top
	const d = o.data
	if (d && typeof d === 'object' && !Array.isArray(d)) {
		const inner = read(d as Record<string, unknown>)
		if (inner.logo || inner.dark_logo || inner.favicon) return inner
		const attrs = (d as Record<string, unknown>).attributes
		if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
			const fromAttrs = read(attrs as Record<string, unknown>)
			if (fromAttrs.logo || fromAttrs.dark_logo || fromAttrs.favicon) return fromAttrs
		}
		const dd = (d as Record<string, unknown>).data
		if (dd && typeof dd === 'object' && !Array.isArray(dd)) {
			const nested = read(dd as Record<string, unknown>)
			if (nested.logo || nested.dark_logo || nested.favicon) return nested
		}
	}
	const settings = (o as Record<string, unknown>).settings
	if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
		const fromSettings = read(settings as Record<string, unknown>)
		if (fromSettings.logo || fromSettings.dark_logo || fromSettings.favicon) return fromSettings
	}
	return null
}
