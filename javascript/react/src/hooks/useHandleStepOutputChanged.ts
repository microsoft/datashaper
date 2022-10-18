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
export function useHandleStepOutputChanged(
	workflow: Workflow,
): (step: Step, output: string | undefined) => void {
	return useCallback(
		(step: Step, output: string | undefined) => {
			// remove any existing output
			const spec = workflow.outputPorts.find(def => def.node === step.id)
			if (spec) {
				workflow.removeOutput(spec.name)
			}

			// if the output is defined, add it
			if (output) {
				workflow.addOutput({ node: step.id, name: output })
			}
		},
		[workflow],
	)
}
