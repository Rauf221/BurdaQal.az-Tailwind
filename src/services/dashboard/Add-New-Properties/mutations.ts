import { useMutation } from '@tanstack/react-query'
import {
	buildAddressStoreFormData,
	buildAddressUpdateFormData,
	buildAnnouncementCoreFormData,
	buildAttributeStoreFormData,
	buildAttributeUpdateFormData,
	buildDetailStoreFormData,
	buildDetailUpdateFormData,
	buildMediaStoreFormData,
	buildMediaUpdateFormData,
	postAnnouncementAddressStore,
	postAnnouncementAddressUpdate,
	postAnnouncementAttributeStore,
	postAnnouncementAttributeUpdate,
	postAnnouncementDetailStore,
	postAnnouncementDetailUpdate,
	postAnnouncementMediaStore,
	postAnnouncementMediaUpdate,
	postAnnouncementStore,
	postAnnouncementUpdate,
} from './announcementApi'
import { extractAnnouncementId } from './extractAnnouncementId'

/** Əsas məlumatlar: yoxdursa store, varsa yalnız core sahələrlə update */
export function useSaveAnnouncementCoreMutation(locale: string) {
	return useMutation({
		mutationFn: async ({
			source,
			announcementId,
		}: {
			source: FormData
			announcementId: number | null
		}) => {
			const coreFd = buildAnnouncementCoreFormData(source)
			if (announcementId == null) {
				const res = await postAnnouncementStore(coreFd, locale)
				const id = extractAnnouncementId(res)
				if (id == null) {
					throw new Error('Server elan identifikatoru qaytarmadı.')
				}
				return { id, created: true as const }
			}
			await postAnnouncementUpdate(announcementId, coreFd, locale)
			return { id: announcementId, created: false as const }
		},
	})
}

/** Ünvan */
export function useSaveAddressSectionMutation(locale: string) {
	return useMutation({
		mutationFn: async ({
			source,
			announcementId,
			addressId,
		}: {
			source: FormData
			announcementId: number
			addressId: number | null
		}) => {
			if (addressId != null) {
				const addrFd = buildAddressUpdateFormData(source)
				await postAnnouncementAddressUpdate(addressId, addrFd, locale)
				return { addressId }
			}
			const addrFd = buildAddressStoreFormData(source, announcementId)
			const res = await postAnnouncementAddressStore(addrFd, locale)
			const id = extractAnnouncementId(res)
			return { addressId: id ?? null }
		},
	})
}

/** Tutum — room, bedroom, bathroom, guest */
export function useSaveDetailSectionMutation(locale: string) {
	return useMutation({
		mutationFn: async ({
			source,
			announcementId,
			detailId,
		}: {
			source: FormData
			announcementId: number
			detailId: number | null
		}) => {
			if (detailId != null) {
				const fd = buildDetailUpdateFormData(source)
				await postAnnouncementDetailUpdate(detailId, fd, locale)
				return { detailId }
			}
			const fd = buildDetailStoreFormData(source, announcementId)
			const res = await postAnnouncementDetailStore(fd, locale)
			const id = extractAnnouncementId(res)
			return { detailId: id ?? null }
		},
	})
}

/** Şəkillər — cover_image, gallery[]; YouTube link media API-də `link` sahəsi ilə */
export function useSaveMediaSectionMutation(locale: string) {
	return useMutation({
		mutationFn: async ({
			source,
			announcementId,
			mediaId,
		}: {
			source: FormData
			announcementId: number
			mediaId: number | null
		}) => {
			if (mediaId != null) {
				const mfd = buildMediaUpdateFormData(source)
				if ([...mfd.keys()].length > 0) {
					await postAnnouncementMediaUpdate(mediaId, mfd, locale)
				}
				return { mediaId }
			}
			const sfd = buildMediaStoreFormData(source, announcementId)
			const cov = sfd.get('cover_image')
			const link = String(sfd.get('link') ?? '').trim()
			const hasMedia =
				(cov instanceof File && cov.size > 0) ||
				[...sfd.getAll('gallery[]')].some((f) => f instanceof File && f.size > 0) ||
				Boolean(link)
			if (!hasMedia) {
				return { mediaId: null }
			}
			const res = await postAnnouncementMediaStore(sfd, locale)
			const id = extractAnnouncementId(res)
			return { mediaId: id ?? null }
		},
	})
}

/** İmkanlar — attribute_id[] */
export function useSaveAttributeSectionMutation(locale: string) {
	return useMutation({
		mutationFn: async ({
			source,
			announcementId,
			didStoreOnce,
		}: {
			source: FormData
			announcementId: number
			didStoreOnce: boolean
		}) => {
			if (didStoreOnce) {
				const fd = buildAttributeUpdateFormData(source)
				await postAnnouncementAttributeUpdate(announcementId, fd, locale)
			} else {
				const fd = buildAttributeStoreFormData(source, announcementId)
				await postAnnouncementAttributeStore(fd, locale)
			}
			return { didStore: true as const }
		},
	})
}
