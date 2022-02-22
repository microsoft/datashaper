/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isDarkMode } from '~localStorageHandler/localStorageHandler'
import { Settings } from '~models/Settings'

export const defaultSettings = async () => {
	try {
		const darkMode = await isDarkMode()
		const settings: Settings = {
			isDarkMode: darkMode,
		}

		return settings
	} catch (error) {
		return {
			isDarkMode: false,
		}
	}
}
