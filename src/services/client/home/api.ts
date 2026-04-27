import { get } from '@/lib/api'
import type { RandomRegionsResponse, SliderListResponse } from '@/types'

const getSlider = async (locale?: string, page?: number) => {
	return get<SliderListResponse>('/slider', {
		locale,
		params: page != null ? { page } : undefined,
	})
}

const getRandomRegions = async (locale?: string) => {
	return get<RandomRegionsResponse>('/random-regions', { locale })
}

export { getSlider, getRandomRegions }
