/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import type { ApplicationSettings } from '../types.js'

const defaultApplicationSettings: ApplicationSettings = {
	darkMode: true,
}

const state = atom<ApplicationSettings>({
	key: 'framework-application-settings',
	default: defaultApplicationSettings,
})

/**
 * Get the recoil state tuple for top-level application settings
 * @returns
 */
export function useApplicationSettings(): [
	ApplicationSettings,
	SetterOrUpdater<ApplicationSettings>,
] {
	return useRecoilState(state)
}

/**
 * Get the application settings value only.
 * @returns
 */
export function useApplicationSettingsValue(): ApplicationSettings {
	return useRecoilValue(state)
}

/**
 * Get the setter for application settings.
 * @returns
 */
export function useSetApplicationSettings(): SetterOrUpdater<ApplicationSettings> {
	return useSetRecoilState(state)
}
