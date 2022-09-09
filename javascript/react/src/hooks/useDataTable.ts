/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Unsubscribe, Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useState } from 'react'

export function useDataTable(
	id: string | undefined,
	workflow?: Workflow,
	existingTable?: ColumnTable,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>(existingTable)

	useEffect(() => {
		if (id && workflow) {
			// listen for changes that may affect output
			let unsubscribeFromOutput: Unsubscribe | undefined
			const unsubscribeFromWorkflow = workflow.onChange(() => {
				unsubscribeFromOutput = extractTableFromWorkflow(workflow, id, setTable)
			}, true)

			// clean up both subscriptions
			return () => {
				unsubscribeFromOutput?.()
				unsubscribeFromWorkflow()
			}
		}
	}, [id, workflow])
	return tbl
}

function extractTableFromWorkflow(
	workflow: Workflow,
	id: string,
	setTable: (table: ColumnTable | undefined) => void,
): Unsubscribe | undefined {
	// If a static input table is passed in, set the state to it
	if (workflow.hasInputName(id)) {
		setTable(workflow.getInputTable(id)?.table)
	} else {
		// Observe the named output
		const observable =
			workflow.outputObservable(id) ?? workflow.outputObservableForNode(id)
		const subscription = observable?.subscribe(t => setTable(t?.table))
		return () => subscription?.unsubscribe()
	}
}
