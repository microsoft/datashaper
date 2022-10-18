/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { map } from 'rxjs'

import { DisplayOrder } from '../enums.js'

const EMPTY: Step[] = []

/**
 * Gets the workflow processing steps
 * @param workflow - the workflow intsance
 * @returns
 */
export function useWorkflowSteps(
	workflow: Workflow,
	order = DisplayOrder.LastOnTop,
): Step[] {
	return (
		useObservableState(workflow.steps$.pipe(map(s => orderSteps(s, order)))) ??
		EMPTY
	)
}

function orderSteps(input: Step[], order: DisplayOrder): Step[] {
	const steps = [...input]
	return order === DisplayOrder.FirstOnTop ? steps : steps.reverse()
}
