/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Settings } from '../models/Settings.js'
import { getDefaultSettings } from '~localStorageHandler/localStorageHandler'

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
