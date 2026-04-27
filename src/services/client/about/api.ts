import { get } from '@/lib/api'
import type {
	AboutAttributesResponse,
	AboutMainData,
	ApiResponse,
	FaqListResponse,
	TeamsResponse,
} from '@/types'

const getAbout = async (locale?: string) => {
	return get<ApiResponse<AboutMainData>>('/about', { locale })
}

const getAboutAttributes = async (locale?: string) => {
	return get<AboutAttributesResponse>('/about-attributes', { locale })
}

const getTeams = async (locale?: string) => {
	return get<TeamsResponse>('/teams', { locale })
}

const getFaq = async (locale?: string) => {
	return get<FaqListResponse>('/faq', { locale })
}

const getBreadcrumb = async (locale?: string) => {
	return get<ApiResponse<AboutMainData>>('/breadcrumb', { locale })
}

export { getAbout, getAboutAttributes, getBreadcrumb, getFaq, getTeams }
