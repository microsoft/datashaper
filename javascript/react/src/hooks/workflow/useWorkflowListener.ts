/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Workflow } from '@datashaper/workflow'
import { useEffect } from 'react'

export function useWorkflowListener(
	workflow: Workflow,
	setWorkflow?: (workflow: Workflow) => void,
): void {
	useEffect(
		() =>
			setWorkflow &&
			workflow.onChange(() => setWorkflow(new Workflow(workflow.toSchema()))),
		[workflow, setWorkflow],
	)
}
