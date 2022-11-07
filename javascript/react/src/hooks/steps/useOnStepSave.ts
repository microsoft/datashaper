/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useOnStepSave(
	workflow: Workflow,
): (step: Step, index: number | undefined) => Step {
	return useCallback(
		(step: Step, index: number | undefined) => {
			const isExistingStep =
				index != null && workflow.length > 0 && index < workflow.length
			return isExistingStep
				? workflow.updateStep(step, index as number)
				: workflow.addStep(step)
		},
		[workflow],
	)
}
