/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { useCallback } from 'react'

export function useAddNewTables(
	store: GraphManager,
): (tables: TableContainer[]) => void {
	return useCallback(
		(tables: TableContainer[]) => {
			tables.forEach(table => {
				const isStored = store.outputs.includes(table.id)
				if (!isStored) {
					store.inputs.set(table.id, table)
				}
			})
		},
		[store],
	)
}
