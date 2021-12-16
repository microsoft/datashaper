/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'
import { useMemo } from 'react'

export function useSlice(
	table: ArqueroTypes.ColumnTable,
	offset: number,
	limit: number,
): ArqueroTypes.ColumnTable {
	return useMemo(() => {
		if (offset === 0 && limit === Infinity) {
			return table
		}
		return table.slice(offset, offset + limit)
	}, [table, limit, offset])
}
