/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useCallback, useEffect, useState } from 'react'

export function useGrouping(table: ColumnTable | undefined) {
	const [grouped, setGrouped] = useState<ColumnTable | undefined>()
	const [metadata, setMetadata] = useState<TableMetadata | undefined>()

	const [groupByList, setGroupByList] = useState<string[]>([])

	useEffect(() => {
		if (table) {
			const local = groupByList.length > 0 ? table.groupby(groupByList) : table
			setGrouped(local)
			setMetadata(introspect(local, true))
		}
	}, [table, groupByList, setGrouped, setMetadata])

	const onGroupChange = useCallback(
		(key: string, checked?: boolean) => {
			setGroupByList(prev =>
				checked ? [...prev, key] : prev.filter(d => d !== key),
			)
		},
		[setGroupByList],
	)

	return {
		grouped,
		metadata,
		onGroupChange,
	}
}
