/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import isArray from 'lodash-es/isArray.js'
import { useMemo } from 'react'

const CELL_LENGTH = 5
const TOOLTIP_LENGTH = 20

export function usePrinted(values: unknown[], length = CELL_LENGTH): string {
	return useMemo(() => {
		// we need to check for array because this cell will still be used to render _after_ the unroll, when the value is no longer an array
		if (isArray(values)) {
			const arr = `[${values.slice(0, length).join(', ')}]`
			return values.length > length ? `${arr}...` : arr
		}
		return values
	}, [values, length])
}

export function useTooltip(values: unknown[], length = TOOLTIP_LENGTH): string {
	return useMemo(() => {
		if (isArray(values)) {
			let tooltip = values.slice(0, length).join('\n')
			if (values.length > length) {
				tooltip += `\n...\n(+${values.length - length} more)`
			}
			return tooltip
		}
		return values
	}, [values, length])
}
