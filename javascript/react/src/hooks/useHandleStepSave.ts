/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphWorkflow, Step } from '@datashaper/core'
import { useCallback } from 'react'

export function useHandleStepSave(
	graph: GraphWorkflow,
): (step: Step, index: number | undefined) => Step {
	return useCallback(
		(step: Step, index: number | undefined) => {
			const isExistingStep =
				index != null && graph.length > 0 && index < graph.length
			return isExistingStep
				? graph.updateStep(step, index as number)
				: graph.addStep(step)
		},
		[graph],
	)
}
