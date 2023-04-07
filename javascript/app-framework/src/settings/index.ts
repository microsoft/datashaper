/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	useSetRecoilState,
	atomFamily,
	useRecoilValue,
	useRecoilState,
	useRecoilTransaction_UNSTABLE,
} from 'recoil'
import type { ApplicationSettings, Settings } from '../types.js'
import type { SetterOrUpdater } from 'recoil'

const defaultApplicationSettings: ApplicationSettings = {
	darkMode: true,
}

// set up a settings key store for profiles.
// we reserve a default '--application--' block for top-level application usage.
const settingsFamily = atomFamily<any, string>({
	key: 'framework-settings',
	default: (profile: string) => {
		switch (profile) {
			case '--application--':
				return defaultApplicationSettings
			default:
				return undefined
		}
	},
})

/**
 * Create a callback for dynamically setting profile settings.
 * @returns
 */
export function useProfileSettingsInitializer(): (
	profile: string,
	value: any,
) => void {
	return useRecoilTransaction_UNSTABLE(({ get, set }) =>
		(profile: string, value: any) => {
			const current = get(settingsFamily(profile))
			// run once only, this is an initializer
			// TODO: wire this through a defaults mechanism on the atom
			if (!current) {
				set(settingsFamily(profile), value)
			}
		})
}
/**
 * Get the recoil state tuple for top-level application settings
 * @returns
 */
export function useApplicationSettings(): [
	ApplicationSettings,
	SetterOrUpdater<ApplicationSettings>,
] {
	return useProfileSettings('--application--')
}

/**
 * Get the application settings value only.
 * @returns
 */
export function useApplicationSettingsValue(): ApplicationSettings {
	return useProfileSettingsValue('--application--')
}

/**
 * Get the setter for application settings.
 * @returns
 */
export function useSetApplicationSettings(): SetterOrUpdater<ApplicationSettings> {
	return useSetProfileSettings('--application--')
}

/**
 * Get the recoil state tuple for a specific profile's settings
 * @param profile
 * @returns
 */
export function useProfileSettings<T extends Settings>(
	profile: string,
): [T, SetterOrUpdater<T>] {
	return useRecoilState(settingsFamily(profile))
}

/**
 * Get a profile's settings value only.
 * @param profile
 * @returns
 */
export function useProfileSettingsValue<T extends Settings>(
	profile: string,
): T {
	return useRecoilValue(settingsFamily(profile))
}

/**
 * Get the setter for a profile's settings.
 */
export function useSetProfileSettings<T extends Settings>(
	profile: string,
): SetterOrUpdater<T> {
	return useSetRecoilState(settingsFamily(profile))
}
