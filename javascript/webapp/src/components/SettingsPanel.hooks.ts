/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import { setDarkMode } from '../localStorageHandler/localStorageHandler.js'
import type { Settings } from '../models/Settings.js'

export function useSetDarkMode(
	settings: Settings,
	setSettings: (settings: Settings) => void,
): (darkMode?: boolean) => void {
	return useCallback(
		async (isDarkMode?: boolean) => {
			setSettings({ ...settings, isDarkMode: !!isDarkMode })
			await setDarkMode(!!isDarkMode)
		},
		[setSettings, settings],
	)
}
