/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { TableStore } from '@data-wrangling-components/core'
import { BaseFile } from '@data-wrangling-components/utilities'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

export function useAddNewTables(
	store: TableStore,
	setStoredTables: (tables: Map<string, ColumnTable>) => void,
): (files: BaseFile[]) => void {
	return useCallback(
		async (files: BaseFile[]) => {
			const existing = store.list()
			const _tables = files.map(async file => {
				const isStored = existing.includes(file.name)
				if (!isStored) {
					const tab = await file?.toTable()
					store.set(file.name, tab)
				}
			})

			await Promise.all(_tables)
			const _storedTables = await store.toMap()
			setStoredTables(_storedTables)
		},
		[store, setStoredTables],
	)
}
