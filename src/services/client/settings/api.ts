import { get } from '@/lib/api'
import type { ApiResponse, MetaTagListResponse, SiteSettingsData, SocialMediaListResponse } from '@/types'

/** `/settings` çox vaxt dil parametri gözləmir; `?locale=` boş və ya səhv cavaba səbəb ola bilər. */
const getSettings = async () => {
	return get<ApiResponse<SiteSettingsData>>('/settings')
}

const getMetaTagList = async (locale?: string) => {
	return get<MetaTagListResponse>('/meta-tag', { locale })
}

const getSocialMediaList = async () => {
	return get<SocialMediaListResponse>('/sosial-media')
}

export { getSettings, getMetaTagList, getSocialMediaList }
