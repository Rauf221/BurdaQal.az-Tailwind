import { queryOptions } from '@tanstack/react-query'
import { getAnnouncementBySlug, getAnnouncements } from './api'

const stale = 60 * 1000

type AnnouncementsFilterOptions = {
	search?: string
	category_id?: string
	region_id?: string
	room?: string
	bedroom?: string
	bathroom?: string
	sort?: string
	min_area?: string
	max_area?: string
	min_price?: string
	max_price?: string
	amenities?: string
	attribute_ids?: string
}

/** Əsas saytda elan siyahısı — GET /announcements + səhifələmə */
export function announcementsListQuery(
	locale?: string,
	page: number = 1,
	filters?: AnnouncementsFilterOptions
) {
	const search = filters?.search?.trim() ?? ''
	const category_id = filters?.category_id?.trim() ?? ''
	const region_id = filters?.region_id?.trim() ?? ''
	const room = filters?.room?.trim() ?? ''
	const bedroom = filters?.bedroom?.trim() ?? ''
	const bathroom = filters?.bathroom?.trim() ?? ''
	const sort = filters?.sort?.trim() ?? ''
	const min_area = filters?.min_area?.trim() ?? ''
	const max_area = filters?.max_area?.trim() ?? ''
	const min_price = filters?.min_price?.trim() ?? ''
	const max_price = filters?.max_price?.trim() ?? ''
	const amenities = filters?.amenities?.trim() ?? ''
	const attribute_ids = filters?.attribute_ids?.trim() ?? ''

	return queryOptions({
		queryKey: [
			'client',
			'properties',
			'announcements',
			locale ?? 'default',
			page,
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
		],
		queryFn: () =>
			getAnnouncements({
				locale,
				page,
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
			}),
		staleTime: stale,
	})
}

/** Tək elan səhifəsi — GET /announcement/{slug} */
export function announcementBySlugQuery(slug: string, locale?: string) {
	return queryOptions({
		queryKey: ['client', 'properties', 'announcement', slug, locale ?? 'default'],
		queryFn: () => getAnnouncementBySlug(slug, { locale }),
		enabled: Boolean(slug),
		staleTime: stale,
	})
}
