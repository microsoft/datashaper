/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import type { RowObject } from 'arquero/dist/types/table/table'
import { op } from 'arquero'

export function useKeyNames(
	table: ColumnTable | undefined,
	column: string,
): string[] {
	return useMemo(() => {		
		const arrayResult = [] 

		if (table !== undefined) {
			const columnSelected: RowObject[] = table.select(column).objects()
			for (let i = 0; i < columnSelected.length; i++) {
				arrayResult.push(...op.keys(JSON.parse(columnSelected[i]![column])))
			}
		}
		return [...new Set(arrayResult)]
	}, [table, column])
}
