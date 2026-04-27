import { queryOptions } from '@tanstack/react-query'
import { getAttributes, getCategories, getRegions } from './api'

const stale = 10 * 60 * 1000

export function categoriesListQuery(locale?: string) {
	return queryOptions({
		queryKey: ['dashboard', 'add-property', 'categories', locale ?? 'default'],
		queryFn: () => getCategories(locale),
		staleTime: stale,
	})
}

export function regionsListQuery(locale?: string) {
	return queryOptions({
		queryKey: ['dashboard', 'add-property', 'regions', locale ?? 'default'],
		queryFn: () => getRegions(locale),
		staleTime: stale,
	})
}

export function attributesListQuery(locale?: string) {
	return queryOptions({
		queryKey: ['dashboard', 'add-property', 'attributes', locale ?? 'default'],
		queryFn: () => getAttributes(locale),
		staleTime: stale,
	})
}
