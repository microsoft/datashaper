/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@datashaper/schema'
import type { IDropdownOption } from '@fluentui/react'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

import { EMPTY_ARRAY } from '../../empty.js'
import { useSimpleDropdownOptions } from '../fluent/useSimpleDropdownOptions.js'

export function useColumnValueOptions(
	column: string | undefined,
	table: ColumnTable | undefined,
	values?: Value[],
	filter?: (value: Value) => boolean,
): IDropdownOption[] {
	const valueList = useMemo(() => {
		if (!(column && table && column) || column.trim().length === 0) {
			return EMPTY_ARRAY
		}
		const getFallback = () => {
			const columnNamesArray: string[] = table
				.columnNames()
				.filter((e) => e === column)

			if (columnNamesArray.length !== 0) {
				const result: any[] = table
					.rollup({
						[column]: op.array_agg_distinct(column),
					})
					.get(column, 0)

				return result ?? EMPTY_ARRAY
			}

			return EMPTY_ARRAY
		}
		const list = values ? values : getFallback()
		return filter ? list.filter(filter) : list
	}, [column, table, values, filter])
	return useSimpleDropdownOptions(valueList)
}
