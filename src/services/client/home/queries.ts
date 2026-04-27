import { queryOptions } from '@tanstack/react-query'
import { getRandomRegions, getSlider } from './api'

const getSliderQuery = (locale?: string, page?: number) => {
	return queryOptions({
		queryKey: ['slider', locale ?? 'default', page ?? 1],
		queryFn: () => getSlider(locale, page),
		staleTime: 2 * 60 * 1000,
	})
}

const getRandomRegionsQuery = (locale?: string) => {
	return queryOptions({
		queryKey: ['random-regions', locale ?? 'default'],
		queryFn: () => getRandomRegions(locale),
		staleTime: 2 * 60 * 1000,
	})
}

export { getSliderQuery, getRandomRegionsQuery }
