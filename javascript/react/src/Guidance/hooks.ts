/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { docs } from '@data-wrangling-components/guidance'
import { useCallback } from 'react'

export const useGuidance = (): ((name: string) => string) => {
	return useCallback((name: string) => {
		return (docs as Record<string, string>)[name] || ''
	}, [])
}
