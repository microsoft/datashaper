/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import { useCallback } from 'react'

/**
 * Returns a hook to generate a new table name based on the given input e.g.
 * "join" could result in "join 1" or "join 2" depending on how many collisions
 *  occur.
 * @param workflow - the workflow instance
 * @returns a safe output name to use
 */
export function useCreateTableId(workflow: Workflow): (name: string) => string {
	return useCallback(
		(name: string): string => workflow.suggestOutputName(name),
		[workflow],
	)
}
