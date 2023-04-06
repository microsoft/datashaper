/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useSetRecoilState, atomFamily, useRecoilValue } from 'recoil'
import type { ApplicationSettings } from '../types.js'
import { useCallback } from 'react'

const defaultApplicationSettings: ApplicationSettings = {
	darkMode: true,
}

// set up a settings key store for resources.
// we reserve a default 'application' block for top-level application usage.
const settingsFamily = atomFamily<any, string>({
	key: 'framework-settings',
	default: (resource: string) => {
		switch (resource) {
			case 'application':
				return defaultApplicationSettings
			default:
				return {}
		}
	},
})

/**
 * Return a [value, setter] tuple for a resource's settings, just like the normal recoil useRecoilState.
 * The variant here is that this allows you to target a specific resource's settings,
 * and the setter also optionally accepts a key to target a specific value instead of the entire block.
 * Note that setting the entire block does a merge over the previous, not a complete overwrite.
 * @param resource
 * @returns
 */
export function useFrameworkSettings(
	resource = 'application',
): [any, (value: any, key?: string) => void] {
	const value = useFrameworkSettingsValue(resource)
	const setter = useSetFrameworkSettings(resource)
	return [value, setter]
}

/**
 * Get a settings block for a resource.
 * @param resource
 * @returns
 */
export function useFrameworkSettingsValue(resource = 'application'): any {
	return useRecoilValue(settingsFamily(resource))
}

/**
 * Get a setter for a resource's settings.
 * If a key is provided in the setter, only that value is written,
 * Otherwise it is the entire block.
 * Note that setting the entire block does a merge over the previous, not a complete overwrite.
 */
export function useSetFrameworkSettings(
	resource = 'application',
): (value: any, key?: string) => void {
	const setter = useSetRecoilState(settingsFamily(resource))
	return useCallback(
		(value: any, key?: string) => {
			setter((prev: any) => {
				if (key) {
					return {
						...prev,
						[key]: value,
					}
				}
				return {
					...prev,
					...value,
				}
			})
		},
		[setter],
	)
}
