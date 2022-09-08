/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useHandleStepSave(
	graph: GraphManager,
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
