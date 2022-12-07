/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { Field } from '@datashaper/schema'
import type { Codebook } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useOnFieldsChanged(resource: Codebook) {
	return useCallback(
		(fields: Field[]) => {
			resource.fields = fields
		},
		[resource],
	)
}
