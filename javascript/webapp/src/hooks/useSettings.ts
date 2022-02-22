/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getDefaultSettings } from '~localStorageHandler/localStorageHandler'

export const defaultSettings = async () => {
	try {
		const defaultSettings = await getDefaultSettings()
		return defaultSettings
	} catch (error) {
		return {
			isDarkMode: false,
		}
	}
}
