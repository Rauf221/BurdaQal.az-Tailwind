import { queryOptions } from '@tanstack/react-query'
import { getAbout, getAboutAttributes, getBreadcrumb, getFaq, getTeams } from './api'

const getAboutQuery = (locale?: string) => {
	return queryOptions({
		queryKey: ['about', locale ?? 'default'],
		queryFn: () => getAbout(locale),
	})
}

const getAboutAttributesQuery = (locale?: string) => {
	return queryOptions({
		queryKey: ['about-attributes', locale ?? 'default'],
		queryFn: () => getAboutAttributes(locale),
	})
}

const getTeamsQuery = (locale?: string) => {
	return queryOptions({
		queryKey: ['teams', locale ?? 'default'],
		queryFn: () => getTeams(locale),
	})
}

const getFaqQuery = (locale?: string) => {
	return queryOptions({
		queryKey: ['faq', locale ?? 'default'],
		queryFn: () => getFaq(locale),
	})
}

const getBreadcrumbQuery = (locale?: string) => {
	return queryOptions({
		queryKey: ['breadcrumb', locale ?? 'default'],
		queryFn: () => getBreadcrumb(locale),
	})
}

export {
	getAboutAttributesQuery,
	getAboutQuery,
	getBreadcrumbQuery,
	getFaqQuery,
	getTeamsQuery,
}
