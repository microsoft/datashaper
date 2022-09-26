/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { useEffect, useState } from 'react'

import { DisplayOrder } from '../enums.js'

/**
 * Gets the workflow processing steps
 * @param workflow - the workflow intsance
 * @returns
 */
export function useWorkflowSteps(
	workflow: Workflow,
	order: DisplayOrder,
): Step[] {
	const [steps, setSteps] = useState<Step[]>(orderSteps(workflow.steps, order))
	// listen for workflow changes and update the steps
	useEffect(() => {
		workflow.onChange(() => {
			setSteps(orderSteps(workflow.steps, order))
		})
	}, [workflow, order, setSteps])
	return steps
}

function orderSteps(_steps: Step[], order: DisplayOrder): Step[] {
	const steps = [..._steps]
	return order === DisplayOrder.FirstOnTop ? steps : steps.reverse()
}
