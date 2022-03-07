/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Dispatch, SetStateAction } from 'react'
import { useCallback } from 'react'

type NameSetter = Dispatch<SetStateAction<string[]>>

export function useGuidance(
	index: Record<string, string>,
): (name: string) => string {
	return useCallback(
		(name: string) => {
			return (index as Record<string, string>)[name] || ''
		},
		[index],
	)
}

export function useHandleClick(setName: NameSetter): (url: string) => void {
	return useCallback(
		(url: string) => {
			if (!url.includes(window.location.origin)) {
				return window.open(url, '_blank')
			}
			const name = url
				.split(`${window.location.origin}/`)
				.pop()
				?.replace('/', '.')
				.replace(/.md/, '')
			if (name) {
				setName((prev: string[]) => [...prev, name])
			}
		},
		[setName],
	)
}

export function useGoBack(setName: NameSetter): () => void {
	return useCallback(() => {
		setName(prev => prev.slice(0, -1))
	}, [setName])
}

export function useGoHome(name: string, setName: NameSetter): () => void {
	return useCallback(() => {
		setName([name])
	}, [setName, name])
}
