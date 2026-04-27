import { userGet, userPost } from '@/lib/api/userClient'
import type { LaravelPaginationLinks, LaravelPaginationMeta } from '@/services/dashboard/Add-New-Properties/api'

/** GET /user/.../announcement — ünvan */
export type MyAnnouncementAddress = {
	id: number
	street: string
	map: string | null
	landmark: string | null
	region_id: number
}

/** Tutum (detail) */
export type MyAnnouncementDetail = {
	id: number
	room: number
	bedroom: number
	bathroom: number
	guest: number
}

/** Media qeydi */
export type MyAnnouncementMedia = {
	id: number
	announcement_id: number
	cover_image: string
	gallery: string[]
	thumb_gallery: string[]
	link: string | null
}

/** Elana bağlı imkan/atribut */
export type MyAnnouncementAttribute = {
	id: number
	name: string
	slug: string
	parent_id: number
	icon: string | null
}

/** Siyahı elementi — istifadəçi elanları */
export type MyAnnouncementItem = {
	id: number
	title: string
	description: string
	price: string
	/** URL üçün (public elan səhifəsi) */
	slug: string
	/** 1 — dərc edilib, 0 — gözləmədə / aktiv deyil (backend mənasına uyğun) */
	status: number
	check_in: string
	check_out: string
	/** Bəzi cavablarda yalnız `category_id`, bəzilərində `category: { id }` gəlir */
	category_id?: number | null
	category?: { id: number; name?: string } | null
	address: MyAnnouncementAddress | null
	detail: MyAnnouncementDetail | null
	media: MyAnnouncementMedia | null
	attributes: MyAnnouncementAttribute[]
}

export type MyAnnouncementsResponse = {
	data: MyAnnouncementItem[]
	links: LaravelPaginationLinks
	meta: LaravelPaginationMeta
}

export type MyAnnouncementShowResponse = {
	timestamp?: string
	status?: boolean
	message?: string
	lang?: string
	data: MyAnnouncementItem
}

export type GetMyAnnouncementsOptions = {
	locale?: string
	/** Laravel səhifələmə — `?page=` */
	page?: number
}

/**
 * İstifadəçinin elanları — GET .../announcement
 * (Postman: Announcement → Elan → GET All). Bearer tələb olunur.
 */
export async function getMyAnnouncements(
	options?: GetMyAnnouncementsOptions
): Promise<MyAnnouncementsResponse> {
	const { locale, page = 1 } = options ?? {}
	return userGet<MyAnnouncementsResponse>('/announcement', {
		params: { page },
		...(locale && { headers: { 'X-Locale': locale } }),
	})
}

/** İstifadəçinin tək elanı — GET .../announcement/show/:id */
export async function getMyAnnouncementById(
	announcementId: number,
	locale?: string
): Promise<MyAnnouncementShowResponse> {
	return userGet<MyAnnouncementShowResponse>(
		`/announcement/show/${announcementId}`,
		locale ? { headers: { 'X-Locale': locale } } : undefined
	)
}

/**
 * Elanı sil — POST .../announcement/delete/:id (Postman: boş JSON body).
 */
export async function deleteAnnouncement(
	announcementId: number,
	locale?: string
): Promise<unknown> {
	return userPost<unknown>(
		`/announcement/delete/${announcementId}`,
		{},
		locale ? { headers: { 'X-Locale': locale } } : undefined
	)
}
