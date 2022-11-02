/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step,Workflow } from '@datashaper/workflow'
import { useCallback } from 'react'

import { useHandleStepOutputChanged, useOnStepSave } from '../index.js'

/**
 *
 * @param workflow - The workflow
 * @returns A callback to use when saving a step, either new or existing
 */
export function useOnSaveStep(
	workflow: Workflow,
): (step: Step, index: number | undefined) => void {
	const updateStep = useOnStepSave(workflow)
	const updateStepOutput = useHandleStepOutputChanged(workflow)

	return useCallback(
		(step: Step, index: number | undefined) => {
			const stepResult = updateStep(step, index)
			updateStepOutput(stepResult)
		},
		[updateStepOutput, updateStep],
	)
}
