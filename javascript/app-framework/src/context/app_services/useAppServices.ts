import { useContext } from 'react'
import { AppServicesContext } from './AppServicesContext.js'

/**
 * Use the app-services context
 * @returns - The current app services
 */
export function useAppServices() {
	return useContext(AppServicesContext)
}
