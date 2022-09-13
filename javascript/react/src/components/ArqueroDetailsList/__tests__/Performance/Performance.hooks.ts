/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type { IColumn } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useMemo, useState } from 'react'

/**
 * Multiply the input table so it's very large
 * @param input
 * @returns
 */
export function useBigTable(input: ColumnTable | undefined) {
	const [local, setTable] = useState<ColumnTable | undefined>()
	const [metadata, setMetadata] = useState<TableMetadata | undefined>()

	useEffect(() => {
		if (input !== undefined) {
			let tableCopy = input
			tableCopy.ungroup()
			// make sure we have a large enough number of rows to impact rendering perf
			for (let i = 0; i < 10; i++) {
				tableCopy = tableCopy.concat(tableCopy)
			}

			setTable(tableCopy)
			setMetadata(introspect(tableCopy, true))
		}
	}, [input])

	return {
		local,
		metadata,
	}
}

/**
 * Create a default IColumm list to render
 * @param table
 * @returns
 */
export function useColumnConfig(table: ColumnTable | undefined) {
	return useMemo((): IColumn[] | undefined => {
		if (table === undefined) return undefined
		return table.columnNames().map(x => {
			return {
				name: x,
				key: x,
				fieldName: x,
				minWidth: 180,
			} as IColumn
		})
	}, [table])
}
