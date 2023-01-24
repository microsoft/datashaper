/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type { Workflow } from '@datashaper/workflow'
import { useEffect } from 'react'

export function useWorkflowOutputListener(
	workflow: Workflow,
	setOutput?: ((tables: TableContainer[]) => void) | undefined,
): void {
	useEffect(
		() =>
			setOutput &&
			workflow.onChange(() => {
				const outputs = (
					workflow.toArray().filter((t) => !!t) as TableContainer[]
				).map((table) => {
					if (table.table && !table.metadata) {
						table.metadata = introspect(table.table, true)
					}
					return table
				})
				setOutput(outputs)
			}, true),
		[workflow, setOutput],
	)
}
