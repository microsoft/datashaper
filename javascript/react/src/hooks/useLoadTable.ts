/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'

export function useLoadTable(
	id: string | undefined,
	table?: ColumnTable,
	graph?: GraphManager,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>()
	const handleTableLoad = useCallback(
		(container: TableContainer | undefined) => setTable(container?.table),
		[setTable],
	)
	useEffect(() => {
		// if a table already exists, use it directly
		// TODO: should we set it in the store also?
		// the expectation here is that a table will be provided if the step component is used directly without a builder
		// interface that is managing a pipeline
		if (table) {
			setTable(table)
		} else if (id && graph) {
			// Case 1: static input table
			if (graph.hasInput(id)) {
				setTable(graph.inputs.get(id)?.table)
			} else {
				// Case 2: derived table
				const observable = graph.output(id) ?? graph.outputForNodeId(id)
				if (observable) {
					const sub = observable.subscribe(t => setTable(t?.table))
					return () => sub.unsubscribe()
				}
			}
		}
	}, [id, table, graph, handleTableLoad])
	return tbl
}
