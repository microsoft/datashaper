/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step, Pipeline } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useOnDeleteStep(
	onUpdateSteps: (steps: Step[]) => void,
	pipeline: Pipeline,
): (index: number) => void {
	return useCallback(
		(index: number) => {
			const _steps = pipeline.delete(index)
			onUpdateSteps(_steps)
		},
		[pipeline, onUpdateSteps],
	)
}
