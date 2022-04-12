/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	TableContainer,
	TableMetadata,
	TableStore,
} from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useOnUpdateMetadata(
	setStoredTables: (tables: Map<string, TableContainer<unknown>>) => void,
	store: TableStore,
	selectedTableName?: string,
): (meta: TableMetadata) => void {
	return useCallback(
		(meta: TableMetadata) => {
			const _table = store.get(selectedTableName as string)
			if (_table) {
				_table.metadata = meta

				store.delete(_table.id)
				store.emitItemChange(_table.id)

				const _storedTables = store.toMap()
				setStoredTables(_storedTables)
			}
		},
		[store, selectedTableName, setStoredTables],
	)
}
