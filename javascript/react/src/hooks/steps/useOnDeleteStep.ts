/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import { useCallback } from 'react'

/**
 * Creates a callback that may be used to delete steps by index
 * @param workflow - The dat workflow
 * @returns A callback that may be used to delete steps by index
 */
export function useOnDeleteStep(workflow: Workflow): (index: number) => void {
	return useCallback((index: number) => workflow.removeStep(index), [workflow])
}
