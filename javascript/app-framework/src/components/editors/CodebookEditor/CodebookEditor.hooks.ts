/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { Codebook } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useContent(codebook: Codebook): string {
	return JSON.stringify(codebook.toSchema(), null, 2)
}

export function useOnChange(
	codebook: Codebook,
): (value: string | undefined) => void {
	return useCallback(
		(value: string | undefined) => {
			codebook.loadSchema(value ? JSON.parse(value) : null)
		},
		[codebook],
	)
}
