'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	postEmailSendOtp,
	postEmailVerify,
	getLogout,
	postForgotPassword,
	postLogin,
	postPasswordChange,
	postPasswordReset,
	postRegister,
	postUpdateUser,
	postVerifyCode,
} from './api'
import { extractAccessToken } from './extractToken'
import {
	setAuthToken,
	clearAuthToken,
	setPasswordResetBearerToken,
	clearPasswordResetBearerToken,
} from '@/lib/api/client'

export function useLoginMutation(locale?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		retry: false,
		mutationFn: (payload: { email: string; password: string }) => {
			const fd = new FormData()
			fd.append('email', payload.email)
			fd.append('password', payload.password)
			return postLogin(fd, locale)
		},
		// Laravel cavabı məs: { data: { token, user } } — extractAccessToken + setAuthToken (cookie access_token)
		onSuccess: (data) => {
			clearPasswordResetBearerToken()
			const token = extractAccessToken(data)
			if (token) {
				setAuthToken(token)
				queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			}
		},
	})
}

export function useRegisterMutation(locale?: string) {
	return useMutation({
		retry: false,
		mutationFn: (payload: {
			name: string
			email: string
			mobile: string
			password: string
			password_confirmation: string
		}) => {
			const fd = new FormData()
			fd.append('name', payload.name)
			fd.append('email', payload.email)
			fd.append('mobile', payload.mobile)
			fd.append('password', payload.password)
			fd.append('password_confirmation', payload.password_confirmation)
			return postRegister(fd, locale)
		},
	})
}

export function useVerifyCodeMutation(locale?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		retry: false,
		mutationFn: (payload: { email: string; code: string }) => {
			const fd = new FormData()
			fd.append('email', payload.email)
			fd.append('code', payload.code)
			return postVerifyCode(fd, locale)
		},
		onSuccess: (data) => {
			clearPasswordResetBearerToken()
			const token = extractAccessToken(data)
			if (token) {
				setAuthToken(token)
				queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			}
		},
	})
}

/**
 * Daxil olmuş profil: POST /verify-code — yalnız `code`.
 * user-profile dərhal refetch edilmir; yoxlama bitəndən sonra POST /update işləmir — form köhnə e-poçta atlanmasın.
 */
export function useVerifyProfileEmailCodeMutation(locale?: string) {
	return useMutation({
		retry: false,
		mutationFn: (payload: { code: string }) => {
			const fd = new FormData()
			fd.append('code', String(payload.code).trim())
			return postVerifyCode(fd, locale)
		},
		onSuccess: (data) => {
			clearPasswordResetBearerToken()
			const token = extractAccessToken(data)
			if (token) {
				setAuthToken(token)
			}
		},
	})
}

/** Email dəyişmə OTP göndərmə: POST /email/send-otp */
export function useSendEmailOtpMutation(locale?: string) {
	return useMutation({
		retry: false,
		mutationFn: (payload: { email: string }) => {
			const fd = new FormData()
			fd.append('email', payload.email.trim())
			return postEmailSendOtp(fd, locale)
		},
	})
}

/** Email dəyişmə OTP yoxlama: POST /email/verify */
export function useVerifyEmailOtpMutation(locale?: string) {
	return useMutation({
		retry: false,
		mutationFn: (payload: { code: string }) => {
			const fd = new FormData()
			fd.append('code', String(payload.code).trim())
			return postEmailVerify(fd, locale)
		},
	})
}

/**
 * Şifrə bərpası OTP təsdiqi — token cookie-də saxlanmır (profil sorğusu 401 ilə əsas tokeni silməsin).
 * Müvəqqəti Bearer yalnız sessionStorage-da saxlanır; userClient həm cookie, həm də onu Authorization-da istifadə edir.
 */
export function useForgotVerifyCodeMutation(locale?: string) {
	return useMutation({
		retry: false,
		mutationFn: (payload: { email: string; code: string }) => {
			const fd = new FormData()
			fd.append('email', payload.email)
			fd.append('code', payload.code)
			return postVerifyCode(fd, locale)
		},
		onSuccess: (data) => {
			const token = extractAccessToken(data)
			if (token) setPasswordResetBearerToken(token)
		},
	})
}

export function useForgotPasswordMutation(locale?: string) {
	return useMutation({
		retry: false,
		mutationFn: (email: string) => {
			const fd = new FormData()
			fd.append('value', email)
			return postForgotPassword(fd, locale)
		},
	})
}

export function usePasswordResetMutation(locale?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		retry: false,
		mutationFn: (payload: {
			password: string
			password_confirmation: string
			code: string
			email?: string
		}) => {
			const fd = new FormData()
			fd.append('password', payload.password)
			fd.append('password_confirmation', payload.password_confirmation)
			fd.append('token', String(payload.code).trim())
			if (payload.email) {
				fd.append('value', payload.email)
			}
			return postPasswordReset(fd, locale)
		},
		onSuccess: (data) => {
			clearPasswordResetBearerToken()
			const token = extractAccessToken(data)
			if (token) {
				setAuthToken(token)
				queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			}
		},
	})
}

function buildUpdateUserFormData(payload: {
	name: string
	email: string
	mobile: string
	image?: File | null
}) {
	const fd = new FormData()
	fd.append('name', payload.name.trim())
	fd.append('email', payload.email.trim())
	fd.append('mobile', payload.mobile.trim())
	if (payload.image) fd.append('image', payload.image)
	return fd
}

export function useUpdateProfileMutation(locale?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		retry: false,
		mutationFn: (payload: {
			name: string
			email: string
			mobile: string
			image?: File | null
		}) => postUpdateUser(buildUpdateUserFormData(payload), locale),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
		},
	})
}

export function usePasswordChangeMutation(locale?: string) {
	return useMutation({
		retry: false,
		mutationFn: (payload: {
			old_password: string
			password: string
			password_confirmation: string
		}) => {
			const fd = new FormData()
			fd.append('old_password', payload.old_password)
			fd.append('password', payload.password)
			fd.append('password_confirmation', payload.password_confirmation)
			return postPasswordChange(fd, locale)
		},
	})
}

export function useLogoutMutation(locale?: string) {
	const queryClient = useQueryClient()
	return useMutation({
		retry: false,
		mutationFn: () => getLogout(locale),
		onSettled: () => {
			clearAuthToken()
			clearPasswordResetBearerToken()
			queryClient.removeQueries({ queryKey: ['user-profile'] })
		},
	})
}
