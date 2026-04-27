import { queryOptions } from '@tanstack/react-query'
import { getBlogRelated, getBlogs, getBlogShow, getTags } from './api'

const getTagsQuery = (locale?: string, page?: number) => {
	return queryOptions({
		queryKey: ['blog-tags', locale ?? 'default', page ?? 1],
		queryFn: () => getTags(locale, page),
	})
}

const getBlogsQuery = (
	locale?: string,
	filters?: { tagSlugs?: string[]; page?: number }
) => {
	const tagKey = filters?.tagSlugs?.length ? filters.tagSlugs.sort().join(',') : 'all'
	return queryOptions({
		queryKey: ['blogs', locale ?? 'default', tagKey, filters?.page ?? 1],
		queryFn: () => getBlogs(locale, filters),
	})
}

const getBlogShowQuery = (slug: string, locale?: string) => {
	return queryOptions({
		queryKey: ['blog-show', slug, locale ?? 'default'],
		queryFn: () => getBlogShow(slug, locale),
		enabled: Boolean(slug),
	})
}

const getBlogRelatedQuery = (slug: string, locale?: string) => {
	return queryOptions({
		queryKey: ['blog-related', slug, locale ?? 'default'],
		queryFn: () => getBlogRelated(slug, locale),
		enabled: Boolean(slug),
	})
}

export { getBlogRelatedQuery, getBlogsQuery, getBlogShowQuery, getTagsQuery }
