/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import cloneDeep from 'lodash-es/cloneDeep.js'
import { useEffect, useState } from 'react'

import { WorkflowOrder } from './../components/ManageWorkflow.types.js'

/**
 * Gets the workflow processing steps
 * @param workflow - the workflow intsance
 * @returns
 */
export function useWorkflowSteps(
	workflow: Workflow,
	order: WorkflowOrder,
): Step[] {
	const [steps, setSteps] = useState<Step[]>(workflow.steps)
	// listen for workflow changes and update the steps
	useEffect(() => {
		setSteps(orderSteps(workflow.steps, order))
		workflow.onChange(() => {
			setSteps(orderSteps(workflow.steps, order))
		})
	}, [workflow, order, setSteps])
	return steps
}

function orderSteps(_steps: Step[], order: WorkflowOrder): Step[] {
	let steps = cloneDeep(_steps)
	if (order === WorkflowOrder.LastOnTop) {
		steps = steps.reverse()
	}
	return steps
}
