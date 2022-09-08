/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Unsubscribe,Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useState } from 'react'

export function useDataTable(
	id: string | undefined,
	graph?: Workflow,
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
	graph: Workflow,
	id: string,
	setTable: (table: ColumnTable | undefined) => void,
): Unsubscribe | undefined {
	// If a static input table is passed in, set the state to it
	if (graph.hasInputName(id)) {
		setTable(graph.getInputTable(id)?.table)
	} else {
		// Observe the named graph output
		const observable =
			graph.outputObservable(id) ?? graph.outputObservableForNode(id)
		const subscription = observable?.subscribe(t => setTable(t?.table))
		return () => subscription?.unsubscribe()
	}
}
