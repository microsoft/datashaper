/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@thematic/core'
import { loadById, ThemeVariant } from '@thematic/core'
import { useDebounceFn } from 'ahooks'
import type { SetterOrUpdater } from 'recoil'
import {
	atom,
	selector,
	useRecoilState,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'

import { defaultSettings } from '../hooks/useSettings.js'
import type { Settings } from '../models/Settings.js'

const currentSettings = atom<Settings>({
	key: 'settings',
	default: defaultSettings(),
})

export function useSettings(): [Settings, SetterOrUpdater<Settings>] {
	return useRecoilState(currentSettings)
}

export function useSettingsValue(): Settings {
	return useRecoilValue(currentSettings)
}

export function useSettingsSetter(): SetterOrUpdater<Settings> {
	return useSetRecoilState(currentSettings)
}

export function useSettingsDebounced(): [Settings, SetterOrUpdater<Settings>] {
	const [settings, setSettings] = useSettings()
	const debouncedSettings = useDebounceFn(
		(newSettings: any) => setSettings(newSettings),
		{
			wait: 250,
		},
	)
	return [settings, debouncedSettings.run]
}

export const themeState = selector<Theme>({
	key: 'theme',
	dangerouslyAllowMutability: true,
	get: ({ get }) => {
		const settings = get(currentSettings)
		const theme = loadById('default', {
			variant: settings.isDarkMode ? ThemeVariant.Dark : ThemeVariant.Light,
		})
		return theme
	},
})

export function useTheme(): Theme {
	return useRecoilValue(themeState)
}
