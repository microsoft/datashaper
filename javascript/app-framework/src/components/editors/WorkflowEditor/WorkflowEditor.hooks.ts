/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { Workflow } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useContent(workflow: Workflow): string {
	const wfSchema = workflow?.toSchema()
	if (wfSchema != null) {
		return JSON.stringify(wfSchema, null, 2)
	}
	return ''
}

export function useOnChange(
	workflow: Workflow,
): (value: string | undefined) => void {
	return useCallback(
		(value: string | undefined) => {
			workflow.loadSchema(value == null ? undefined : JSON.parse(value))
		},
		[workflow],
	)
}
