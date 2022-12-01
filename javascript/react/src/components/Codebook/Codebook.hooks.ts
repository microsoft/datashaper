/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Field } from '@datashaper/schema'
import { useCallback, useMemo, useState } from 'react'

import {
	DATA_NATURE,
	DATA_TYPE,
	DESCRIPTION,
	DISPLAY_NAME,
	MAPPING_FIELD,
	MAPPING_WRAPPER,
	STATS_WRAPPER,
	UNITS,
} from './Codebook.types.js'

export interface FieldHeights {
	get: (key: string) => number | undefined
	set: (key: string, value: number) => void
}
export function useFieldHeights(): FieldHeights {
	const [heights, setHeights] = useState<Record<string, number>>({
		displayName: DISPLAY_NAME,
		description: DESCRIPTION,
		units: UNITS,
		dataType: DATA_TYPE,
		dataNature: DATA_NATURE,
		statsWrapper: STATS_WRAPPER,
		mappingWrapper: MAPPING_WRAPPER,
	})
	return useMemo(
		() => ({
			get: (key: string) => heights[key],
			set: (key: string, value: number) =>
				setHeights(prev => ({
					...prev,
					[key]: value,
				})),
		}),
		[heights, setHeights],
	)
}

export function useUpdateMappingHeights(
	heights: FieldHeights,
): (newFields: Field[]) => void {
	return useCallback(
		(newFields: Field[]) => {
			const max = Math.max(
				...newFields.map(x => Object.keys(x?.mapping || {}).length),
			)
			const actual = heights.get('mappingWrapper') || 0
			const newHeight = MAPPING_WRAPPER + max * MAPPING_FIELD

			if (actual !== newHeight) {
				heights.set('mappingWrapper', newHeight)
			}
		},
		[heights],
	)
}
