/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { format } from 'd3-format'
import isNil from 'lodash-es/isNil.js'
import { useMemo } from 'react'

export function useFormattedNumber(
	value: number | undefined,
	formatter?: string,
): string {
	return useMemo(() => {
		if (isNil(value)) {
			return ''
		}
		if (formatter) {
			const f = format(formatter)
			return f(value)
		}
		return value.toString()
	}, [value, formatter])
}
