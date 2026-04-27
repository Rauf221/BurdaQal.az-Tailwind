'use client'

import { useMutation } from '@tanstack/react-query'
import { postContactForm, postSubscribe } from './api'

const useContactFormMutation = (locale?: string) => {
	return useMutation({
		mutationFn: (payload: { name: string; email: string; phone: string; note: string }) => {
			const fd = new FormData()
			fd.append('name', payload.name)
			fd.append('email', payload.email)
			fd.append('phone', payload.phone)
			fd.append('note', payload.note)
			return postContactForm(fd, locale)
		},
	})
}

const useSubscribeMutation = (locale?: string) => {
	return useMutation({
		mutationFn: (email: string) => {
			const fd = new FormData()
			fd.append('email', email)
			return postSubscribe(fd, locale)
		},
	})
}

export { useContactFormMutation, useSubscribeMutation }
