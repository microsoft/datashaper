/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDebounceFn } from 'ahooks'
import {
	atom,
	SetterOrUpdater,
	useRecoilState,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'
import { Settings } from '~models/Settings.js'
import { defaultSettings } from '~hooks/useSettings.js'

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

export const useSettingsDebounced = (): [
	Settings,
	SetterOrUpdater<Settings>,
] => {
	const [settings, setSettings] = useSettings()
	const debouncedSettings = useDebounceFn(
		(newSettings: any) => setSettings(newSettings),
		{
			wait: 250,
		},
	)
	return [settings, debouncedSettings.run]
}
