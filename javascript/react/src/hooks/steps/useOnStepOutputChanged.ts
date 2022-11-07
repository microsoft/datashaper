/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { useCallback } from 'react'

/**
 * This hooks handles managing a step's output within the workflow. This hook assumes
 * that each step will have a single output, which will become an invariant we expand upon
 * in the future.
 *
 * @param workflow - the workflow instance
 * @returns A callback to use when the step output changes
 */
export function useOnStepOutputChanged(
	workflow: Workflow,
): (step: Step) => void {
	return useCallback(
		(step: Step) => {
			// remove any existing output
			if (workflow.hasOutputName(step.id)) {
				workflow.removeOutput(step.id)
			}

			// if the output is defined, add it
			workflow.addOutput(step.id)
		},
		[workflow],
	)
}
