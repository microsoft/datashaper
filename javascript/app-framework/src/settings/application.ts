/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	type SetterOrUpdater,
	atom,
	useRecoilState,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'

const LOCAL_STORAGE_KEY = 'app-framework-application-settings'
const DEFAULT = {}

const storageEffect =
	(key: string) =>
	({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
		// initialize from ls if present
		try {
			const saved = localStorage.getItem(key)
			setSelf(saved ? JSON.parse(saved) : DEFAULT)
		} catch (_e) {
			// quietly ignore ls errors
			console.warn('Error reading settings from local storage, using defaults.')
			setSelf(DEFAULT)
		}

		// sync ls on update
		onSet((newValue: unknown, _old: unknown, isReset: boolean) => {
			try {
				isReset
					? localStorage.removeItem(key)
					: localStorage.setItem(key, JSON.stringify(newValue))
			} catch (_e) {
				// quietly ignore ls errors
				console.warn('Error saving settings to local storage.')
			}
		})
	}

const state = atom<unknown>({
	key: 'framework-application-settings',
	default: DEFAULT,
	effects: [storageEffect(LOCAL_STORAGE_KEY)],
})

/**
 * Return a read-only copy of the application settings.
 * Note that settings are managed in the centralized settings panel.
 * @returns
 */
export function useApplicationSettingsValue(): unknown {
	return useRecoilValue(state)
}

/**
 * Returns a value and setter for the application settings.
 */
export function useApplicationSettings(): [unknown, SetterOrUpdater<unknown>] {
	return useRecoilState(state)
}

/**
 * Sets the default settings for the application if provided to the component.
 * Only runs if defaults haven't already been set (don't want to override local storage).
 */
export function useSetDefaultApplicationSettings(): (
	settings: unknown,
) => void {
	const setter = useSetRecoilState(state)
	return useCallback(
		(defaults: unknown) => {
			setter((prev: unknown) => {
				// not set yet, initializing
				if (prev === DEFAULT) {
					return defaults
				}
				return prev
			})
		},
		[setter],
	)
}
