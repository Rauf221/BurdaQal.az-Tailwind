import type { AxiosRequestConfig } from 'axios'
import { get, post } from '@/lib/api'
import { getAcceptLanguageHeader } from '@/lib/utils'
import type { ApiResponse, ContactMainData } from '@/types'

const DEFAULT_MAP_EMBED =
	'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2643.6895046810805!2d-122.52642526124438!3d38.00014098339506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085976736097a2f%3A0xbe014d20e6e22654!2sSan%20Rafael%2C%20California!5e0!3m2!1sen!2s!4v1678975266976!5m2!1sen!2s'

/** Xəritə iframe üçün src: tam URL, yoxsa ünvandan embed. */
export function getContactMapEmbedSrc(contact: ContactMainData | undefined): string {
	if (!contact) return DEFAULT_MAP_EMBED
	const mapRaw = contact.map?.trim()
	if (mapRaw?.startsWith('http://') || mapRaw?.startsWith('https://')) {
		return mapRaw
	}
	const addr = contact.address?.trim()
	if (addr) {
		return `https://maps.google.com/maps?q=${encodeURIComponent(addr)}&hl=az&z=16&output=embed`
	}
	return DEFAULT_MAP_EMBED
}

export function getContactMapExternalUrl(contact: ContactMainData | undefined): string {
	if (!contact?.address?.trim()) return '#'
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address.trim())}`
}

const localeHeaders = (locale?: string): Pick<AxiosRequestConfig, 'headers'> => ({
	headers: locale ? { 'Accept-Language': getAcceptLanguageHeader(locale) } : undefined,
})

const getContact = async (locale?: string) => {
	return get<ApiResponse<ContactMainData>>('/contact', { locale })
}

const postContactForm = async (formData: FormData, locale?: string) => {
	return post<unknown>('/contact-form', formData, {
		...localeHeaders(locale),
	})
}

const postSubscribe = async (formData: FormData, locale?: string) => {
	return post<unknown>('/subscribe', formData, {
		...localeHeaders(locale),
	})
}

export { getContact, postContactForm, postSubscribe }
