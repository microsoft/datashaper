/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

export const useGuidance = (
	index: Record<string, string>,
): ((name: string) => string) => {
	return useCallback(
		(name: string) => {
			return (index as Record<string, string>)[name] || ''
		},
		[index],
	)
}
