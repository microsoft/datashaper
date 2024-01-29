/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import type { RowObject } from 'arquero/dist/types/table/table'

export function useKeyNames(
	table: ColumnTable | undefined,
	column: string,
): string[] {
	return useMemo(() => {
		const distinctKeys = new Set<string>()

		if (table !== undefined) {
			const columnSelected: RowObject[] = table.select(column).objects()

			for (let i = 0; i < columnSelected.length; i++) {
				if (!Array.isArray(columnSelected[i]![column])) {
					//is an object
					const singleObj = JSON.parse(columnSelected[i]![column])

					for (const property in singleObj) distinctKeys.add(property)
				}
			}
		}

		return Array.from(distinctKeys.values())
	}, [table, column])
}
