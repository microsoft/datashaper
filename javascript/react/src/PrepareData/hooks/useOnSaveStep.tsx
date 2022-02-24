/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Pipeline, Step } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useOnSaveStep(
	onUpdateSteps: (steps: Step[]) => void,
	pipeline: Pipeline,
): (step: Step, index?: number) => void {
	return useCallback(
		(step: Step, index?: number) => {
			if (index !== undefined) {
				onUpdateSteps(pipeline.update(step, index))
			} else {
				onUpdateSteps(pipeline.add(step))
			}
		},
		[pipeline, onUpdateSteps],
	)
}
