/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import { useCallback, useState } from 'react'

export function useTables(): {
	tables: TableContainer[]
	onAddTables: (update: TableContainer[]) => void
} {
	const [tables, setTables] = useState<TableContainer[]>([])

	const onAddTables = useCallback(
		(update: TableContainer[]) => {
			setTables(prev => [...prev, ...update])
		},
		[setTables],
	)

	return {
		tables,
		onAddTables,
	}
}
