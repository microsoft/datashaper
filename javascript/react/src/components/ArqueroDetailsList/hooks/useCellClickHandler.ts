/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import { noop } from '../../functions.js'
import type { ColumnClickFunction } from '../index.js'

export function useCellClickhandler(
	clickable: boolean,
	onColumnClick: ColumnClickFunction = noop,
): ColumnClickFunction | undefined {
	return useMemo(
		() => (clickable ? onColumnClick : undefined),
		[clickable, onColumnClick],
	)
}
