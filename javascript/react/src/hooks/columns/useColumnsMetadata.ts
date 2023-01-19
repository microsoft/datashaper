/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { columnType } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

import { EMPTY_ARRAY } from '../../empty.js'

export function useColumnsMetadata(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
): Field[] {
	return useMemo(() => {
		const columns = table?.columnNames(filter) || EMPTY_ARRAY
		const result: Field[] = columns.map((col) => {
			const type: DataType = !(table && col)
				? DataType.Unknown
				: columnType(table, col)
			return { name: col, type: type }
		})
		return result
	}, [table, filter])
}
