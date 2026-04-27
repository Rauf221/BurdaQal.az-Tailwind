/**
 * Axios client (`lib/api/client`) üçün CASIO ilə eyni dil başlığı məntiqi.
 * Tam `lib/utils` (cn, toast və s.) lazım olanda genişləndirilə bilər.
 */
export function getCurrentLocale(): string {
	if (typeof window !== 'undefined') {
		const pathname = window.location.pathname
		const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/)
		if (localeMatch) {
			const locale = localeMatch[1]
			if (['az', 'en', 'ru'].includes(locale)) {
				return locale
			}
		}
	}
	return 'az'
}

export function getAcceptLanguageHeader(locale?: string): string {
	const currentLocale = locale || getCurrentLocale()
	const localeMap: Record<string, string> = {
		az: 'az-AZ,az;q=0.9,en;q=0.8',
		en: 'en-US,en;q=0.9,az;q=0.8',
		ru: 'ru-RU,ru;q=0.9,en;q=0.8',
	}
	return localeMap[currentLocale] || localeMap['az']
}
