import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Settings } from '../models/Settings.js'
import { setDarkMode } from '../localStorageHandler/localStorageHandler.js'

export function useName(): string {
	const location = useLocation()
	return useMemo<string>(() => {
		switch (location.pathname) {
			case '/debug':
				return 'debugPage'
			case '/performance':
				return 'perfPage'
			case '/':
			default:
				return 'prepareDataPage'
		}
	}, [location])
}

export function useSetDarkMode(
	settings: Settings,
	setSettings: (settings: Settings) => void,
): (darkMode?: boolean) => void {
	return useCallback(
		async (isDarkMode?: boolean) => {
			setSettings({ ...settings, isDarkMode: !!isDarkMode })
			await setDarkMode(!!isDarkMode)
		},
		[setSettings],
	)
}
