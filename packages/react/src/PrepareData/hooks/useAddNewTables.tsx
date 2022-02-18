/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type {
	TableStore,
	TableContainer,
} from '@data-wrangling-components/core'
import type { BaseFile } from '@data-wrangling-components/utilities'
import { useCallback } from 'react'

export function useAddNewTables(
	store: TableStore,
	setStoredTables: (tables: Map<string, TableContainer>) => void,
): (files: BaseFile[]) => void {
	return useCallback(
		async (files: BaseFile[]) => {
			const existing = store.list()
			const _tables = files.map(async file => {
				const isStored = existing.includes(file.name)
				if (!isStored) {
					const tab = await file?.toTable()
					store.set({ id: file.name, table: tab })
				}
			})

			await Promise.all(_tables)
			const _storedTables = await store.toMap()
			setStoredTables(_storedTables)
		},
		[store, setStoredTables],
	)
}
