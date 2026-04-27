import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type AxiosError,
	type InternalAxiosRequestConfig,
	type AxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'
import { getAcceptLanguageHeader } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/** İstifadəçi API və əsas API üçün eyni cookie adı. */
export const TOKEN_COOKIE_NAME = 'access_token'

const client: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
})

/** Token dəyişəndə navbar və s. komponentlər yenilənsin. */
export const AUTH_TOKEN_CHANGED_EVENT = 'auth-token-changed'

function notifyAuthTokenChanged(): void {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent(AUTH_TOKEN_CHANGED_EVENT))
	}
}

export const getAuthToken = (): string | null => {
	return Cookies.get(TOKEN_COOKIE_NAME) || null
}

export const setAuthToken = (token: string): void => {
	Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 7, sameSite: 'Lax', path: '/' })
	notifyAuthTokenChanged()
}

export const clearAuthToken = (): void => {
	Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' })
	notifyAuthTokenChanged()
}

/** Şifrə bərpası verify cavabındakı Bearer — cookie-də saxlanmır ki, profil sorğusu 401 ilə tokeni silməsin. */
const PW_RESET_BEARER_KEY = 'user_api_password_reset_bearer'

export const setPasswordResetBearerToken = (token: string | null): void => {
	if (typeof window === 'undefined') return
	if (token) {
		sessionStorage.setItem(PW_RESET_BEARER_KEY, token)
	} else {
		sessionStorage.removeItem(PW_RESET_BEARER_KEY)
	}
}

export const getPasswordResetBearerToken = (): string | null => {
	if (typeof window === 'undefined') return null
	return sessionStorage.getItem(PW_RESET_BEARER_KEY)
}

export const clearPasswordResetBearerToken = (): void => {
	setPasswordResetBearerToken(null)
}

const handleUnauthorized = (): void => {
	clearAuthToken()
}

const handleApiError = (error: AxiosError): void => {
	if (error.response?.status === 401) {
		handleUnauthorized()
	} else if (error.response?.status === 403) {
		console.error('Access forbidden')
	} else if (error.response && error.response.status >= 500) {
		console.error('Server error:', error.response.status)
	}
}

const setupInterceptors = (): void => {
	client.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			const token = getAuthToken()
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`
			}

			if (config.data instanceof FormData && config.headers) {
				delete config.headers['Content-Type']
			}

			if (config.headers) {
				const configLocale = config.params?.locale || config.headers['X-Locale']

				if (configLocale) {
					config.headers['Accept-Language'] = getAcceptLanguageHeader(String(configLocale))
				} else {
					config.headers['Accept-Language'] = getAcceptLanguageHeader('az')
				}
			}

			if (config.url?.includes('products-filter')) {
				console.log('Axios request URL:', config.url)
				console.log('Axios request data:', JSON.stringify(config.data, null, 2))
				console.log('Axios request data type:', typeof config.data)
				console.log('Axios request data is array?', Array.isArray(config.data))
			}

			return config
		},
		(error: AxiosError) => {
			return Promise.reject(error)
		}
	)

	client.interceptors.response.use(
		(response: AxiosResponse) => response,
		(error: AxiosError) => {
			handleApiError(error)
			return Promise.reject(error)
		}
	)
}

setupInterceptors()

export const get = async <T>(
	url: string,
	config?: AxiosRequestConfig & { locale?: string }
): Promise<T> => {
	const requestConfig: AxiosRequestConfig = {
		...config,
		params: {
			...config?.params,
			...(config?.locale && { locale: config.locale }),
		},
	}
	const response = await client.get<T>(url, requestConfig)
	return response.data
}

export const post = async <T>(
	url: string,
	data?: unknown,
	config?: AxiosRequestConfig
): Promise<T> => {
	const response = await client.post<T>(url, data, config)
	return response.data
}

export const put = async <T>(
	url: string,
	data?: unknown,
	config?: AxiosRequestConfig
): Promise<T> => {
	const response = await client.put<T>(url, data, config)
	return response.data
}

export const patch = async <T>(
	url: string,
	data?: unknown,
	config?: AxiosRequestConfig
): Promise<T> => {
	const response = await client.patch<T>(url, data, config)
	return response.data
}

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
	const response = await client.delete<T>(url, config)
	return response.data
}

export const apiClient = {
	get,
	post,
	put,
	patch,
	delete: del,
}

export default apiClient
