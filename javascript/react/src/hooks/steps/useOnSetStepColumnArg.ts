/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import isArray from 'lodash-es/isArray.js'
import { useCallback } from 'react'

export function useOnSetStepColumnArg(): (
	stepArgs: unknown,
	newName?: string,
) => object {
	return useCallback((stepArgs: unknown, newName = 'New column') => {
		const args = stepArgs as Record<string, unknown>
		if (args['to'] && !isArray(args['to'])) {
			args['to'] = newName
		}
		return args
	}, [])
}
