/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type {
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

export function useAddNewTables(
	store: TableStore,
	setStoredTables: (tables: Map<string, ColumnTable>) => void,
): (tables: TableContainer[]) => void {
	return useCallback(
		async (tables: TableContainer[]) => {
			const existing = store.list()
			tables.forEach(table => {
				const isStored = existing.includes(table.name)
				if (!isStored) {
					store.set(table.name, table?.table as ColumnTable)
				}
			})

			const _storedTables = await store.toMap()
			setStoredTables(_storedTables)
		},
		[store, setStoredTables],
	)
}
