/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import type { ColumnClickFunction } from '../index.js'

export function useCellClickhandler(
	clickable: boolean,
	onColumnClick?: ColumnClickFunction,
): ColumnClickFunction | undefined {
	return useMemo(
		() =>
			clickable
				? (evt?, column?) => onColumnClick && onColumnClick(evt, column)
				: undefined,
		[clickable, onColumnClick],
	)
}
