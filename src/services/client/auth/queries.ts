import { queryOptions } from '@tanstack/react-query'
import { getUserInfo } from './api'

export function getUserProfileQuery(locale?: string) {
	return queryOptions({
		queryKey: ['user-profile', locale ?? 'default'],
		queryFn: () => getUserInfo(locale),
		staleTime: 60 * 1000,
	})
}
