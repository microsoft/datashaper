/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useOnDeleteStep(
	onUpdateSteps: (steps: Step[]) => void,
	steps?: Step[],
): (index: number) => void {
	return useCallback(
		(index: number) => {
			let _steps = [...(steps || [])]
			_steps = _steps.slice(0, index)
			onUpdateSteps(_steps)
		},
		[steps, onUpdateSteps],
	)
}
