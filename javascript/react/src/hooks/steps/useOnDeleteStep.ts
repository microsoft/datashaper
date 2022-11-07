/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useOnDeleteStep(workflow: Workflow): (index: number) => void {
	return useCallback(
		(index: number) => {
			workflow.removeStep(index)
		},
		[workflow],
	)
}
