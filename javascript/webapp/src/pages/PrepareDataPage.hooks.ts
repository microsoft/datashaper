/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renameDuplicatedFileName } from '@datashaper/utilities'
import type { TableContainer } from '@essex/arquero'
import { useCallback, useState } from 'react'

export function useTables(setSelectedTableId: (id: string) => void): {
	tables: TableContainer[]
	onAddTables: (update: TableContainer[]) => void
} {
	const [tables, setTables] = useState<TableContainer[]>([])

	const onAddTables = useCallback(
		(update: TableContainer[]) => {
			if (update.length > 0) {
				const map = new Map<string, number>()
				const allTables = [...tables, ...update]
				const renamedTables = allTables.map(t => ({
					...t,
					id: renameDuplicatedFileName(map, t.id),
				}))
				setSelectedTableId(renamedTables[renamedTables.length - 1]?.id)
				setTables(renamedTables)
			}
		},
		[setTables, setSelectedTableId, tables],
	)

	return {
		tables,
		onAddTables,
	}
}
