/**
 * Login / verify cavabından Bearer token çıxarır.
 * Laravel nümunəsi: { "data": { "token": "18|...", "user": { ... } }, "message": "..." }
 */
export function extractAccessToken(payload: unknown): string | null {
	if (payload == null) return null

	const tryString = (v: unknown): string | null => {
		if (typeof v === 'string' && v.length > 0) return v
		if (typeof v === 'number' && Number.isFinite(v)) return String(v)
		return null
	}

	const pickFromRecord = (rec: Record<string, unknown>): string | null =>
		tryString(rec.access_token) ||
		tryString(rec.token) ||
		tryString(rec.accessToken) ||
		tryString(rec.plainTextToken)

	if (typeof payload === 'string' && payload.length > 20) {
		return payload
	}

	if (typeof payload !== 'object') return null
	const o = payload as Record<string, unknown>

	let fromData: unknown = o.data

	
	if (typeof fromData === 'string' && fromData.trim().startsWith('{')) {
		try {
			fromData = JSON.parse(fromData) as unknown
		} catch {
			fromData = o.data
		}
	}

	if (fromData && typeof fromData === 'object' && !Array.isArray(fromData)) {
		const d = fromData as Record<string, unknown>
		const t = pickFromRecord(d)
		if (t) return t

		
		const nested = d.data
		if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
			const t2 = pickFromRecord(nested as Record<string, unknown>)
			if (t2) return t2
		}

		const user = d.user
		if (user && typeof user === 'object' && !Array.isArray(user)) {
			const u = user as Record<string, unknown>
			const ut = tryString(u.access_token) || tryString(u.token)
			if (ut) return ut
		}
	}

	return pickFromRecord(o)
}
