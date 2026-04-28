import { get } from '@/lib/api'
import type { PaginatedListResponse } from '@/services/dashboard/Add-New-Properties/api'

/** Əsas API elan siyahısı — GET /announcements cavabındakı istifadəçi */
export type PublicAnnouncementUser = {
	name: string
	mobile: string
	email: string
	verified: number
	image: string | null
	username: string
}

export type PublicAnnouncementCategory = {
	id: number
	name: string
	slug: string
}

export type PublicAnnouncementAddress = {
	id: number
	street: string
	map: string | null
	landmark: string | null
	region_id: number
	/** Bölgə adı (məs. "Baku") */
	region_name?: string | null
}

export type PublicAnnouncementDetail = {
	id: number
	room: number
	bedroom: number
	bathroom: number
	guest: number
	/** Bəzi cavablarda `media` ilə paralel şəkil yolları */
	cover_image?: string | null
	cover_image_thumb?: string | null
}

export type PublicAnnouncementMedia = {
	id: number
	announcement_id: number
	cover_image: string
	/** Kart / siyahı üçün üz şəklinin yüngül variantı (`cover_image` tam ölçü) */
	cover_image_thumb?: string | null
	gallery: string[]
	thumb_gallery: string[]
	/** YouTube / video URL (bəzi cavablarda yalnız burada) */
	link?: string | null
}

export type PublicAnnouncementAttribute = {
	id: number
	name: string
	slug: string
	parent_id: number
	icon: string | null
}

/** GET /announcements — tək element */
export type PublicAnnouncementItem = {
	id: number
	title: string
	description: string
	price: string
	check_in: string
	check_out: string
	slug: string
	category?: PublicAnnouncementCategory | null
	address: PublicAnnouncementAddress | null
	detail: PublicAnnouncementDetail | null
	media: PublicAnnouncementMedia | null
	attributes: PublicAnnouncementAttribute[]
	user: PublicAnnouncementUser
	/** Media `link` / YouTube */
	video_youtube_url?: string | null
	/** Bəzi backend versiyalarında ola bilər */
	status?: number
}

export type PublicAnnouncementsResponse = PaginatedListResponse<PublicAnnouncementItem>

/** GET /announcement/{slug} — tək elan (Show) */
export type PublicAnnouncementShowResponse = {
	data: PublicAnnouncementItem
}

export type GetAnnouncementsOptions = {
	locale?: string
	/** Laravel `?page=` */
	page?: number
	search?: string
	category_id?: string | number
	region_id?: string | number
	/** GET /announcements — Postman: room, bedroom, bathroom */
	room?: string | number
	bedroom?: string | number
	bathroom?: string | number
	/** `new` | `old` */
	sort?: string
	/** Əlavə filtrlər — backend dəstəkləyirsə tətbiq olunur */
	min_area?: string | number
	max_area?: string | number
	min_price?: string | number
	max_price?: string | number
	/** Köhnə: vergüllə slug */
	amenities?: string
	/** İmkanlar: vergüllə attribute id */
	attribute_ids?: string
}

export type GetAnnouncementBySlugOptions = {
	locale?: string
}

/**
 * Bütün elanlar (əsas API) — GET …/announcements
 * `NEXT_PUBLIC_API_BASE_URL` üzərindən; Bearer varsa interceptor əlavə edir.
 */
function addIfNonEmpty(
	target: Record<string, string | number>,
	key: string,
	value: string | number | null | undefined,
) {
	if (value == null) return
	const s = String(value).trim()
	if (s !== '') target[key] = s
}

export async function getAnnouncements(
	options?: GetAnnouncementsOptions
): Promise<PublicAnnouncementsResponse> {
	const {
		locale,
		page = 1,
		search,
		category_id,
		region_id,
		room,
		bedroom,
		bathroom,
		sort,
		min_area,
		max_area,
		min_price,
		max_price,
		amenities,
		attribute_ids,
	} = options ?? {}
	const params: Record<string, string | number> = { page }
	if (search != null && String(search).trim() !== '') {
		params.search = String(search).trim()
	}
	if (category_id != null && String(category_id).trim() !== '') {
		params.category_id = String(category_id).trim()
	}
	if (region_id != null && String(region_id).trim() !== '') {
		params.region_id = String(region_id).trim()
	}
	addIfNonEmpty(params, 'room', room)
	addIfNonEmpty(params, 'bedroom', bedroom)
	addIfNonEmpty(params, 'bathroom', bathroom)
	addIfNonEmpty(params, 'sort', sort)
	addIfNonEmpty(params, 'min_area', min_area)
	addIfNonEmpty(params, 'max_area', max_area)
	addIfNonEmpty(params, 'min_price', min_price)
	addIfNonEmpty(params, 'max_price', max_price)
	addIfNonEmpty(params, 'amenities', amenities)
	addIfNonEmpty(params, 'attribute_ids', attribute_ids)
	return get<PublicAnnouncementsResponse>('/announcements', {
		params,
		...(locale && { locale }),
	})
}

/**
 * Tək elan slug ilə — GET …/announcement/{slug}
 */
export async function getAnnouncementBySlug(
	slug: string,
	options?: GetAnnouncementBySlugOptions
): Promise<PublicAnnouncementShowResponse> {
	const { locale } = options ?? {}
	return get<PublicAnnouncementShowResponse>(
		`/announcement/${encodeURIComponent(slug)}`,
		{
			...(locale && { locale }),
		}
	)
}

/**
 * cover_image, gallery və s. nisbi yolları tam URL-ə çevirir (storage əsas API domenində).
 */
export function publicStorageUrl(path: string | null | undefined): string | null {
	if (path == null || path === '') return null
	if (path.startsWith('http')) return path
	const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
	try {
		const u = new URL(base)
		const p = path.startsWith('/') ? path : `/${path}`
		return `${u.origin}${p}`
	} catch {
		return path
	}
}
