/**
 * Laravel cavabından elan id-ni çıxarır: data.id, data.data.id və s.
 */
export function extractAnnouncementId(payload: unknown): number | null {
	if (payload == null || typeof payload !== 'object') return null

	const pick = (v: unknown): number | null => {
		if (typeof v === 'number' && Number.isFinite(v)) return v
		if (typeof v === 'string' && /^\d+$/.test(v)) return Number(v)
		return null
	}

	const o = payload as Record<string, unknown>
	const top = pick(o.id)
	if (top != null) return top

	const data = o.data
	if (typeof data === 'number') return pick(data)
	if (data != null && typeof data === 'object' && !Array.isArray(data)) {
		const d = data as Record<string, unknown>
		const id1 = pick(d.id)
		if (id1 != null) return id1

		const nested = d.data
		if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
			const id2 = pick((nested as Record<string, unknown>).id)
			if (id2 != null) return id2
		}

		const ann = d.announcement
		if (ann != null && typeof ann === 'object') {
			const id3 = pick((ann as Record<string, unknown>).id)
			if (id3 != null) return id3
		}
	}

	return null
}
