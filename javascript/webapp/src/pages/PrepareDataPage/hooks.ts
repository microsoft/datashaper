/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type { TableContainer } from '@data-wrangling-components/core'
import { useCallback, useState } from 'react'

export function useTablesState(): [
	TableContainer[],
	(tables: TableContainer[]) => void,
] {
	const [tables, setTablesState] = useState<TableContainer[]>([])

	const setTables = useCallback(
		(update: TableContainer[]) => {
			setTablesState((prev: TableContainer[]) =>
				!update.length ? [] : [...prev, ...update],
			)
		},
		[setTablesState],
	)

	return [tables, setTables]
}
