import { extractSettingsFromApiPayload, resolveMediaUrl } from '@/lib/media-url'
import { getAcceptLanguageHeader } from '@/lib/utils'
import { getApiBaseUrl } from '@/providers/server'
import type { MetaTagListResponse, MetaTagRow, SiteSettingsData } from '@/types'
import { cache } from 'react'

const REVALIDATE_SEC = 300

async function fetchSiteSettingsUncached(
	locale = 'az',
): Promise<SiteSettingsData | null> {
	const base = getApiBaseUrl()
	if (!base) return null
	try {
		const res = await fetch(`${base}/settings`, {
			next: { revalidate: REVALIDATE_SEC },
			headers: {
				'Accept-Language': getAcceptLanguageHeader(locale),
			},
		})
		if (!res.ok) return null
		const body: unknown = await res.json()
		const loose = extractSettingsFromApiPayload(body)
		if (!loose) return null
		const resolved = {
			logo: resolveMediaUrl(base, loose.logo),
			dark_logo: resolveMediaUrl(base, loose.dark_logo),
			favicon: resolveMediaUrl(base, loose.favicon),
		}
		if (!resolved.logo && !resolved.dark_logo && !resolved.favicon) return null
		return resolved
	} catch {
		return null
	}
}

/** Eyni sorğu renderində təkrarlanmasın (metadata + layout). */
export const fetchSiteSettings = cache(fetchSiteSettingsUncached)

export async function fetchMetaTagList(locale: string): Promise<MetaTagListResponse | null> {
	const base = getApiBaseUrl()
	if (!base) return null
	try {
		const res = await fetch(`${base}/meta-tag`, {
			next: { revalidate: REVALIDATE_SEC },
			headers: {
				'Accept-Language': getAcceptLanguageHeader(locale),
			},
		})
		if (!res.ok) return null
		return (await res.json()) as MetaTagListResponse
	} catch {
		return null
	}
}

export function pickMetaRow(list: MetaTagListResponse | null, name: string): MetaTagRow | null {
	const row = list?.data?.find((r) => r.name === name)
	return row ?? null
}

/** Vergül və ya yarımvergül ilə ayrılmış açar sözlər. */
export function metaKeywordsToArray(raw: string | undefined): string[] | undefined {
	if (!raw?.trim()) return undefined
	const parts = raw
		.split(/[,;]/)
		.map((s) => s.trim())
		.filter(Boolean)
	return parts.length ? parts : undefined
}
