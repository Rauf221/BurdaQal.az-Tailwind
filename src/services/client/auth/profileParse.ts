/** GET get-user cavabından forma sahələri (Laravel data / data.user). */
export type UserProfileFormFields = {
	name: string
	email: string
	mobile: string
	description: string
	imageUrl: string | null
}

export function parseUserProfilePayload(payload: unknown): UserProfileFormFields {
	const empty: UserProfileFormFields = {
		name: '',
		email: '',
		mobile: '',
		description: '',
		imageUrl: null,
	}
	if (payload == null || typeof payload !== 'object') return empty
	const o = payload as Record<string, unknown>
	let node: Record<string, unknown> = o
	if (o.data != null && typeof o.data === 'object') {
		node = o.data as Record<string, unknown>
		if (node.user != null && typeof node.user === 'object') {
			node = node.user as Record<string, unknown>
		}
	}
	const img = node.image ?? node.avatar ?? node.photo
	return {
		name: typeof node.name === 'string' ? node.name : '',
		email: typeof node.email === 'string' ? node.email : '',
		mobile: node.mobile != null ? String(node.mobile) : '',
		description:
			typeof node.description === 'string'
				? node.description
				: typeof node.sv === 'string'
					? node.sv
					: '',
		imageUrl: typeof img === 'string' && img.trim() ? img.trim() : null,
	}
}

export function resolveUserMediaUrl(pathOrUrl: string | null | undefined): string | null {
	if (pathOrUrl == null || typeof pathOrUrl !== 'string') return null
	const t = pathOrUrl.trim()
	if (!t) return null
	if (t.startsWith('http://') || t.startsWith('https://') || t.startsWith('data:')) return t
	const base = process.env.NEXT_PUBLIC_USER_API_BASE_URL ?? ''
	const baseTrim = base.replace(/\/$/, '')
	const path = t.startsWith('/') ? t : `/${t}`
	return `${baseTrim}${path}`
}
