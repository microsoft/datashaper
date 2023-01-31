/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { Resource } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useJsonContent(resource: Resource): string {
	return JSON.stringify(resource.toSchema(), null, 2)
}

export function useOnChange(
	resource: Resource,
): (value: string | undefined) => void {
	return useCallback(
		(value: string | undefined) => {
			resource.loadSchema(value ? JSON.parse(value) : null)
		},
		[resource],
	)
}
