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
import type { ProfileSettings } from '../types.js'
import type { SetterOrUpdater } from 'recoil'

// set up a settings key store for profiles.
// we reserve a default '--application--' block for top-level application usage.
const state = atomFamily<any, string>({
	key: 'framework-settings',
	default: () => undefined,
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
			const current = get(state(profile))
			// run once only, this is an initializer
			// TODO: wire this through a defaults mechanism on the atom
			if (!current) {
				set(state(profile), value)
			}
		})
}

/**
 * Get the recoil state tuple for a specific profile's settings
 * @param profile
 * @returns
 */
export function useProfileSettings<T extends ProfileSettings>(
	profile: string,
): [T, SetterOrUpdater<T>] {
	return useRecoilState(state(profile))
}

/**
 * Get a profile's settings value only.
 * @param profile
 * @returns
 */
export function useProfileSettingsValue<T extends ProfileSettings>(
	profile: string,
): T {
	return useRecoilValue(state(profile))
}

/**
 * Get the setter for a profile's settings.
 */
export function useSetProfileSettings<T extends ProfileSettings>(
	profile: string,
): SetterOrUpdater<T> {
	return useSetRecoilState(state(profile))
}
