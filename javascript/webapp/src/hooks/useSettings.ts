/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getDefaultSettings } from '../localStorageHandler/localStorageHandler'
import type { Settings } from '../models/Settings.js'

export async function defaultSettings(): Promise<Settings> {
	try {
		const defaultSettings: Settings = await getDefaultSettings()
		return defaultSettings
	} catch (error) {
		return {
			isDarkMode: false,
		}
	}
}
