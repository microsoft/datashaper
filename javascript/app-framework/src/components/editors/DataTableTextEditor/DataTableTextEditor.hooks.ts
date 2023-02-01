/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { useState, useEffect, useCallback } from 'react'
import type { DataTable } from '@datashaper/workflow'

export function useContent(resource: DataTable): string | undefined {
	const [content, setContent] = useState<string | undefined>()
	useEffect(() => {
		resource.data?.text().then(setContent)
	}, [resource, setContent])
	return content
}

export function useOnChange(
	resource: DataTable,
): (value: string | undefined) => void {
	return useCallback(
		(value: string | undefined) => {
			resource.data = new Blob([value || ''])
		},
		[resource],
	)
}
