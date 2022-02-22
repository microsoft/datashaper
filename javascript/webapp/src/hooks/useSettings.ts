import { Settings } from '~models/Settings.js'
import { isDarkMode } from '~localStorageHandler/localStorageHandler.js'

export const defaultSettings = async () => {
	try {
		let darkMode = await isDarkMode()
		let settings: Settings = {
			isDarkMode: darkMode,
		}

		return settings
	} catch (error) {
		return {
			isDarkMode: false,
		}
	}
}
