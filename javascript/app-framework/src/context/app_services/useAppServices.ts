/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useContext } from 'react'
import type { AppServices } from '../../types.js'
import { AppServicesContext } from './AppServicesContext.js'

/**
 * Use the app-services context
 * @returns - The current app services
 */
export function useAppServices(): AppServices {
	return useContext(AppServicesContext)
}
