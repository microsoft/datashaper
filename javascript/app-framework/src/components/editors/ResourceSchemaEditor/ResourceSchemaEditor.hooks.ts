/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { Resource } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useContent(resource: Resource): string {
	const schema = resource?.toSchema()
	if (schema != null) {
		return JSON.stringify(schema, null, 2)
	}
	return ''
}

export function useOnChange(
	resource: Resource,
): (value: string | undefined) => void {
	return useCallback(
		(value: string | undefined) => {
			resource.loadSchema(value == null ? undefined : JSON.parse(value))
		},
		[resource],
	)
}
