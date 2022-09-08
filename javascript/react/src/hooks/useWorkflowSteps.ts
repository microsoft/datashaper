/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { useEffect, useState } from 'react'

/**
 * Gets the workflow processing steps
 * @param workflow - the workflow intsance
 * @returns
 */
export function useWorkflowSteps(workflow: Workflow): Step[] {
	const [steps, setSteps] = useState<Step[]>(workflow.steps)
	// listen for workflow changes and update the steps
	useEffect(() => {
		setSteps(workflow.steps)
		workflow.onChange(() => setSteps(workflow.steps))
	}, [workflow, setSteps])
	return steps
}
