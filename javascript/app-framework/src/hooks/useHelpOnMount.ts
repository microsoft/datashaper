/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { useAppServices } from '../context/app_services/useAppServices.js'

/**
 * Request help when a component renders
 * @param key - The help key to request
 */
export function useHelpOnMount(key: string): void {
	const api = useAppServices()
	useEffect(() => api.requestHelp(key), [api, key])
}
