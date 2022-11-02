/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import { useEffect, useState } from 'react'

export function useWorkflow(
	input?: Workflow | undefined,
	inputs?: TableContainer[],
): Workflow {
	const [workflow, setWorkflow] = useState(
		() => new Workflow(input?.toSchema()),
	)

	// this effect should fire when a new workflow json is uploaded
	useEffect(
		function resetWorkflowWhenWorkflowChanges() {
			setWorkflow(new Workflow(input?.toSchema()))
		},
		[input],
	)

	useEffect(
		function syncDataTablesWhenInputsChange() {
			if (inputs) {
				workflow.addInputTables(inputs)
			}
		},
		[workflow, inputs],
	)

	return workflow
}
