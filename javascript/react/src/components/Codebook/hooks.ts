/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Field } from '@datashaper/schema'
import { useMemo, useState } from 'react'

import {
	DATA_NATURE,
	DATA_TYPE,
	DESCRIPTION,
	DISPLAY_NAME,
	MAPPING_FIELD,
	MAPPING_WRAPPER,
	STATS_WRAPPER,
	UNITS,
} from './constants.js'
import type { FieldHeights } from './types.js'

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
	return useMemo(() => {
		const get = (key: string) => heights[key]
		const set = (key: string, value: number) =>
			setHeights((prev) => ({
				...prev,
				[key]: value,
			}))
		const updateAllMapping = (newFields: Field[]) => {
			const max = Math.max(
				...newFields.map((x) => Object.keys(x?.mapping || {}).length),
			)
			const actual = get('mappingWrapper') || 0
			const newHeight = MAPPING_WRAPPER + max * MAPPING_FIELD

			if (actual !== newHeight) {
				set('mappingWrapper', newHeight)
			}
		}
		return {
			get,
			set,
			updateAllMapping,
		}
	}, [heights, setHeights])
}
