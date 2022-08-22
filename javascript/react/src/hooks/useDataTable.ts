/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@datashaper/core'
import type { Unsubscribe } from '@datashaper/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useState } from 'react'

export function useDataTable(
	id: string | undefined,
	graph?: GraphManager,
	existingTable?: ColumnTable,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>(existingTable)

	useEffect(() => {
		if (id && graph) {
			// listen for graph changes that may affect output
			let unsubscribeFromOutput: Unsubscribe | undefined
			const unsubscribeFromGraph = graph.onChange(() => {
				unsubscribeFromOutput = extractTableFromGraph(graph, id, setTable)
			}, true)

			// clean up both subscriptions
			return () => {
				unsubscribeFromOutput?.()
				unsubscribeFromGraph()
			}
		}
	}, [id, graph])
	return tbl
}

function extractTableFromGraph(
	graph: GraphManager,
	id: string,
	setTable: (table: ColumnTable | undefined) => void,
): Unsubscribe | undefined {
	// If a static input table is passed in, set the state to it
	if (graph.hasInput(id)) {
		setTable(graph.inputs.get(id)?.table)
	} else {
		// Observe the named graph output
		const observable = graph.output(id) ?? graph.outputForNodeId(id)
		const subscription = observable?.subscribe(t => setTable(t?.table))
		return () => subscription?.unsubscribe()
	}
}
