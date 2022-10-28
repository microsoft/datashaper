/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

const CELL_LENGTH = 5
const TOOLTIP_LENGTH = 20

export function usePrinted(values: unknown[], length = CELL_LENGTH) {
	return useMemo(() => {
		const arr = `[${values.slice(0, length).join(', ')}]`
		return values.length > length ? `${arr}...` : arr
	}, [values, length])
}

export function useTooltip(values: unknown[], length = TOOLTIP_LENGTH) {
	return useMemo(() => {
		let tooltip = values.slice(0, length).join('\n')
		if (values.length > length) {
			tooltip += `\n...\n(+${values.length - length} more)`
		}
		return tooltip
	}, [values, length])
}
