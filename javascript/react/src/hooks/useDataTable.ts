/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useState } from 'react'

export function useDataTable(
	id: string | undefined,
	graph?: GraphManager,
	existingTable?: ColumnTable,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>()

	useEffect(() => {
		// if a table already exists, use it directly
		// TODO: should we set it in the store also?
		// the expectation here is that a table will be provided if the step component is used directly without a builder
		// interface that is managing a pipeline
		if (existingTable) {
			setTable(existingTable)
		}

		if (id && graph) {
			// If a static input table is passed in, set the state to it
			if (graph.hasInput(id)) {
				setTable(graph.inputs.get(id)?.table)
			}
			// Set the current value
			const current = graph.latest(id) ?? graph.latestForNodeId(id)
			if (current) setTable(current?.table)

			// Observe the named graph output
			const observable = graph.output(id) ?? graph.outputForNodeId(id)
			const sub = observable?.subscribe(t => setTable(t?.table))
			return () => sub?.unsubscribe()
		}
	}, [id, existingTable, graph])
	return tbl
}
