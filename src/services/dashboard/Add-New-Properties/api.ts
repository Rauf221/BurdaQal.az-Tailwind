import { get } from '@/lib/api'

/** POST /categories, /regions — backend ilə eyni */
export type CategoryItem = {
	id: number
	name: string
	slug: string
}

export type RegionItem = {
	id: number
	name: string
	slug: string
}

export type AttributeItem = {
	id: number
	name: string
	slug: string
	parent_id: number
	icon: string | null
}

export type LaravelPaginationLinks = {
	first: string | null
	last: string | null
	prev: string | null
	next: string | null
}

export type LaravelPaginationMeta = {
	current_page: number
	from: number | null
	last_page: number
	path: string
	per_page: number
	to: number | null
	total: number
	links?: Array<{ url: string | null; label: string; active: boolean }>
}

export type PaginatedListResponse<T> = {
	data: T[]
	links: LaravelPaginationLinks
	meta: LaravelPaginationMeta
}

/** GET /attributes — yalnız data massivi */
export type AttributesListResponse = {
	data: AttributeItem[]
}

export async function getCategories(locale?: string) {
	return get<PaginatedListResponse<CategoryItem>>('/categories', { locale })
}

export async function getRegions(locale?: string) {
	return get<PaginatedListResponse<RegionItem>>('/regions', { locale })
}

export async function getAttributes(locale?: string) {
	return get<AttributesListResponse>('/attributes', { locale })
}

/** parent_id === 0 bölmələr və uşaq atributlar (imkanlar / qaydalar) */
export type AttributeSection = {
	parent: AttributeItem
	children: AttributeItem[]
}

export function groupAttributesByParent(flat: AttributeItem[]): AttributeSection[] {
	const parents = flat.filter((a) => a.parent_id === 0).sort((a, b) => a.id - b.id)
	return parents.map((parent) => ({
		parent,
		children: flat.filter((a) => a.parent_id === parent.id).sort((a, b) => a.id - b.id),
	}))
}
