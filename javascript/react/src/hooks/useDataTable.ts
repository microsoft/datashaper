/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@datashaper/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useLayoutEffect, useState } from 'react'
import type { Subscription } from 'rxjs'

export function useDataTable(
	id: string | undefined,
	graph?: GraphManager,
	existingTable?: ColumnTable,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>(existingTable)

	useLayoutEffect(() => {
		if (id && graph) {
			let observableSub: Subscription | undefined
			const unsubscribeFromGraph = graph.onChange(() => {
				// If a static input table is passed in, set the state to it
				if (graph.hasInput(id)) {
					const result = graph.inputs.get(id)?.table
					setTable(result)
					return
				}
				// Observe the named graph output
				const observable = graph.output(id) ?? graph.outputForNodeId(id)

				observableSub = observable?.subscribe(t => setTable(t?.table))
			})

			// clean up both subscriptions
			return () => {
				unsubscribeFromGraph()
				observableSub?.unsubscribe()
			}
		}
	}, [id, graph])
	return tbl
}
