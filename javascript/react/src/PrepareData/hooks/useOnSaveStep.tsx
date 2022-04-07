/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useOnSaveStep(
	onUpdateSteps: (steps: Step[]) => void,
	steps?: Step[],
): (step: Step, index?: number) => void {
	return useCallback(
		(step: Step, index?: number) => {
			if (index !== undefined) {
				const _steps = [...(steps || [])]
				_steps[index] = step
				onUpdateSteps(_steps)
			} else {
				const _steps = [...(steps || []), step]
				onUpdateSteps(_steps)
			}
		},
		[steps, onUpdateSteps],
	)
}
