/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import noop from 'lodash-es/noop.js'
import { useMemo } from 'react'

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
