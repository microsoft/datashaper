/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import isArray from 'lodash-es/isArray.js'
import { useCallback } from 'react'

export function useFormattedColumnArg(): (
	stepArgs: unknown,
	newName?: string,
) => object {
	return useCallback((stepArgs: unknown, newName = 'New column') => {
		const args = stepArgs as Record<string, unknown>
		Object.keys(args).forEach(key => {
			if (key === 'to' && !isArray(args[key])) {
				args[key] = newName
			}
		})
		return args
	}, [])
}
