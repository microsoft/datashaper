/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useState } from 'react'

/**
 * Multiply the input table so it's very large
 * @param input
 * @returns
 */
export function useBigTable(input: ColumnTable | undefined): {
	local: ColumnTable | undefined
	metadata: TableMetadata | undefined
} {
	const [local, setTable] = useState<ColumnTable | undefined>()
	const [metadata, setMetadata] = useState<TableMetadata | undefined>()

	useEffect(() => {
		if (input !== undefined) {
			let tableCopy = input
			// make sure we have a large enough number of rows to impact rendering perf
			for (let i = 0; i < 10; i++) {
				tableCopy = tableCopy.concat(tableCopy)
			}
			setTable(tableCopy)
			setMetadata(introspect(tableCopy, true))
		}
	}, [input, setTable, setMetadata])

	return {
		local,
		metadata,
	}
}
