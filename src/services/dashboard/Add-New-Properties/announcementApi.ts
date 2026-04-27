import { userPost } from '@/lib/api/userClient'
import type { AxiosRequestConfig } from 'axios'

function withLocale(locale: string): AxiosRequestConfig {
	return { headers: { 'X-Locale': locale } }
}

/** POST .../announcement/store (multipart/form-data) */
export async function postAnnouncementStore(fd: FormData, locale: string): Promise<unknown> {
	return userPost<unknown>('/announcement/store', fd, withLocale(locale))
}

/** POST .../announcement/update/:id */
export async function postAnnouncementUpdate(
	announcementId: number,
	fd: FormData,
	locale: string
): Promise<unknown> {
	return userPost<unknown>(`/announcement/update/${announcementId}`, fd, withLocale(locale))
}

/** POST .../announcement-address/store */
export async function postAnnouncementAddressStore(fd: FormData, locale: string): Promise<unknown> {
	return userPost<unknown>('/announcement-address/store', fd, withLocale(locale))
}

/** POST .../announcement-address/update/:id — Postman: region_id, street, map, landmark */
export async function postAnnouncementAddressUpdate(
	addressId: number,
	fd: FormData,
	locale: string
): Promise<unknown> {
	return userPost<unknown>(`/announcement-address/update/${addressId}`, fd, withLocale(locale))
}

/** POST .../announcement-detail/store — room, bedroom, bathroom, guest */
export async function postAnnouncementDetailStore(fd: FormData, locale: string): Promise<unknown> {
	return userPost<unknown>('/announcement-detail/store', fd, withLocale(locale))
}

/** POST .../announcement-detail/update/:id */
export async function postAnnouncementDetailUpdate(
	detailId: number,
	fd: FormData,
	locale: string
): Promise<unknown> {
	return userPost<unknown>(`/announcement-detail/update/${detailId}`, fd, withLocale(locale))
}

/** POST .../announcement-media/store — cover_image, gallery[], announcement_id, link */
export async function postAnnouncementMediaStore(fd: FormData, locale: string): Promise<unknown> {
	return userPost<unknown>('/announcement-media/store', fd, withLocale(locale))
}

/** POST .../announcement-media/update/:id */
export async function postAnnouncementMediaUpdate(
	mediaId: number,
	fd: FormData,
	locale: string
): Promise<unknown> {
	return userPost<unknown>(`/announcement-media/update/${mediaId}`, fd, withLocale(locale))
}

/** POST .../announcement-attribute/store — announcement_id, attribute_id[] */
export async function postAnnouncementAttributeStore(fd: FormData, locale: string): Promise<unknown> {
	return userPost<unknown>('/announcement-attribute/store', fd, withLocale(locale))
}

/** POST .../announcement-attribute/update/:announcementId — yalnız attribute_id[] */
export async function postAnnouncementAttributeUpdate(
	announcementId: number,
	fd: FormData,
	locale: string
): Promise<unknown> {
	return userPost<unknown>(`/announcement-attribute/update/${announcementId}`, fd, withLocale(locale))
}

const CORE_ANNOUNCEMENT_KEYS = [
	'title',
	'description',
	'price',
	'category_id',
	'check_in',
	'check_out',
] as const

/** Yalnız əvvəlki addım — announcement store/update (Postman core) */
export function buildAnnouncementCoreFormData(source: FormData): FormData {
	const fd = new FormData()
	for (const key of CORE_ANNOUNCEMENT_KEYS) {
		const v = source.get(key)
		if (v === null || v === '') continue
		if (typeof v === 'string') fd.append(key, v)
	}
	return fd
}

/** Form sahələrindən room_count → room və s. (Postman Detail) */
export function buildDetailStoreFormData(source: FormData, announcementId: number): FormData {
	const fd = new FormData()
	fd.append('announcement_id', String(announcementId))
	fd.append('room', String(source.get('room_count') ?? '').trim())
	fd.append('bedroom', String(source.get('bed_count') ?? '').trim())
	fd.append('bathroom', String(source.get('bathroom_count') ?? '').trim())
	fd.append('guest', String(source.get('max_guests') ?? '').trim())
	return fd
}

export function buildDetailUpdateFormData(source: FormData): FormData {
	const fd = new FormData()
	fd.append('room', String(source.get('room_count') ?? '').trim())
	fd.append('bedroom', String(source.get('bed_count') ?? '').trim())
	fd.append('bathroom', String(source.get('bathroom_count') ?? '').trim())
	fd.append('guest', String(source.get('max_guests') ?? '').trim())
	return fd
}

/** Postman Media store — gallery[] (formda gallery_images[]), link (video_youtube_url -> link) */
export function buildMediaStoreFormData(source: FormData, announcementId: number): FormData {
	const fd = new FormData()
	fd.append('announcement_id', String(announcementId))
	const cover = source.get('cover_image')
	if (cover instanceof File && cover.size > 0) fd.append('cover_image', cover)
	for (const f of source.getAll('gallery_images[]')) {
		if (f instanceof File && f.size > 0) fd.append('gallery[]', f)
	}
	const link = String(source.get('link') ?? source.get('video_youtube_url') ?? '').trim()
	if (link) fd.append('link', link)
	return fd
}

export function buildMediaUpdateFormData(source: FormData): FormData {
	const fd = new FormData()
	const cover = source.get('cover_image')
	if (cover instanceof File && cover.size > 0) fd.append('cover_image', cover)
	for (const f of source.getAll('gallery_images[]')) {
		// API dəyişikliyi: update endpoint yeni şəkilləri `new_images[]` ilə qəbul edir.
		if (f instanceof File && f.size > 0) fd.append('new_images[]', f)
	}
	for (const imagePath of source.getAll('deleted_images[]')) {
		const p = normalizeDeletedImagePath(imagePath)
		if (p) fd.append('deleted_images[]', p)
	}
	const link = String(source.get('link') ?? source.get('video_youtube_url') ?? '').trim()
	if (link) fd.append('link', link)
	return fd
}

function normalizeDeletedImagePath(value: FormDataEntryValue | null): string {
	const raw = String(value ?? '').trim()
	if (!raw) return ''
	try {
		// Backend adətən storage path gözləyir; full URL gəlsə pathname-ə sal.
		if (/^https?:\/\//i.test(raw)) {
			const parsed = new URL(raw)
			return parsed.pathname || ''
		}
	} catch {
		// URL parse alınmasa xam dəyəri saxla.
	}
	return raw
}

function appendAttributeIds(source: FormData, target: FormData): void {
	for (const id of source.getAll('attribute_id[]')) {
		target.append('attribute_id[]', id as string)
	}
	for (const id of source.getAll('attribute_ids[]')) {
		target.append('attribute_id[]', id as string)
	}
}

export function buildAttributeStoreFormData(source: FormData, announcementId: number): FormData {
	const fd = new FormData()
	fd.append('announcement_id', String(announcementId))
	appendAttributeIds(source, fd)
	return fd
}

export function buildAttributeUpdateFormData(source: FormData): FormData {
	const fd = new FormData()
	appendAttributeIds(source, fd)
	return fd
}

/** Ünvan store — Postman: announcement_id, region_id, street, map, landmark */
export function buildAddressStoreFormData(source: FormData, announcementId: number): FormData {
	const fd = new FormData()
	fd.append('announcement_id', String(announcementId))
	const region = source.get('region_id')
	fd.append('region_id', region !== null && region !== '' ? String(region) : '')
	fd.append('street', String(source.get('street_address') ?? ''))
	const map = source.get('map') ?? source.get('iframe_link')
	fd.append('map', String(map ?? ''))
	fd.append('landmark', String(source.get('landmark') ?? ''))
	return fd
}

/** Ünvan update — elan id-siz */
export function buildAddressUpdateFormData(source: FormData): FormData {
	const fd = new FormData()
	const region = source.get('region_id')
	fd.append('region_id', region !== null && region !== '' ? String(region) : '')
	fd.append('street', String(source.get('street_address') ?? ''))
	const map = source.get('map') ?? source.get('iframe_link')
	fd.append('map', String(map ?? ''))
	fd.append('landmark', String(source.get('landmark') ?? ''))
	return fd
}
