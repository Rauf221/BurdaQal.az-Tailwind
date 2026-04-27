import type { AxiosRequestConfig } from 'axios'
import { get } from '@/lib/api'
import type {
	BlogRelatedResponse,
	BlogShowResponse,
	BlogsListResponse,
	TagsListResponse,
} from '@/types'

const getTags = async (locale?: string, page?: number) => {
	return get<TagsListResponse>('/tags', {
		locale,
		params: page != null ? { page } : undefined,
	})
}

const getBlogs = async (
	locale?: string,
	opts?: { tagSlugs?: string[]; page?: number }
) => {
	const tagSlugs = opts?.tagSlugs?.filter(Boolean) ?? []
	const config: AxiosRequestConfig & { locale?: string } = {
		locale,
		params: {
			...(opts?.page != null ? { page: opts.page } : {}),
		},
	}

	if (tagSlugs.length > 0) {
		config.paramsSerializer = (p) => {
			const usp = new URLSearchParams()
			const pageVal = p?.page as number | undefined
			const loc = p?.locale as string | undefined
			if (pageVal != null) usp.set('page', String(pageVal))
			if (loc) usp.set('locale', loc)
			for (const slug of tagSlugs) {
				usp.append('tag[]', slug)
			}
			return usp.toString()
		}
	}

	return get<BlogsListResponse>('/blogs', config)
}

const getBlogShow = async (slug: string, locale?: string) => {
	return get<BlogShowResponse>(`/blog/show/${encodeURIComponent(slug)}`, { locale })
}

const getBlogRelated = async (slug: string, locale?: string) => {
	return get<BlogRelatedResponse>(`/blog/related/${encodeURIComponent(slug)}`, { locale })
}

export { getBlogRelated, getBlogs, getBlogShow, getTags }
