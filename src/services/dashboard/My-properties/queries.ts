import { queryOptions } from '@tanstack/react-query'
import { getMyAnnouncementById, getMyAnnouncements } from './api'

const stale = 60 * 1000

export function myAnnouncementsListQuery(locale?: string, page: number = 1) {
	return queryOptions({
		queryKey: ['dashboard', 'my-properties', 'announcements', locale ?? 'default', page],
		queryFn: () => getMyAnnouncements({ locale, page }),
		staleTime: stale,
	})
}

export function myAnnouncementShowQuery(announcementId: number, locale?: string) {
	return queryOptions({
		queryKey: ['dashboard', 'my-properties', 'announcement-show', announcementId, locale ?? 'default'],
		queryFn: () => getMyAnnouncementById(announcementId, locale),
		enabled: Number.isFinite(announcementId) && announcementId > 0,
		staleTime: stale,
	})
}
