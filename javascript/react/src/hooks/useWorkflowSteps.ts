/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
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
	const observable = useMemo(
		() => workflow.steps$.pipe(map(s => orderSteps(s, order))),
		[workflow, order],
	)
	return useObservableState(observable) ?? EMPTY
}

function orderSteps(input: Step[], order: DisplayOrder): Step[] {
	const steps = [...input]
	return order === DisplayOrder.FirstOnTop ? steps : steps.reverse()
}
