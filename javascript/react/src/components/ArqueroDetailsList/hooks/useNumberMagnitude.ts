/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FieldMetadata } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import isNil from 'lodash-es/isNil.js'
import { useMemo } from 'react'

export function useNumberMagnitude(
	value: any,
	metadata?: FieldMetadata,
	type?: DataType,
): number {
	return useMemo(() => {
		if (type !== DataType.Number || isNil(value)) {
			return 0
		}
		const range = (metadata?.maximum || 1) - (metadata?.minimum || 0)
		const mag = range === 0 ? 0 : (value - (metadata?.minimum || 0)) / range
		return mag
	}, [type, value, metadata])
}
