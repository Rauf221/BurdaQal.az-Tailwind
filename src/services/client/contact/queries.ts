import { queryOptions } from '@tanstack/react-query'
import { getContact } from './api'

const getContactQuery = (locale?: string) => {
	return queryOptions({
		queryKey: ['contact', locale ?? 'default'],
		queryFn: () => getContact(locale),
		staleTime: 5 * 60 * 1000,
	})
}

export { getContactQuery }
