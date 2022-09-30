/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import { useMemo } from 'react'

import {
	HISTOGRAM_HEADER_COMPACT_HEIGHT,
	HISTOGRAM_HEADER_HEIGHT,
} from '../ArqueroDetailsList.constants.js'
import type { Dimensions } from '../renderers/types.js'

export function useCellDimensions(
	column?: IColumn,
	considerCompactMode = true,
): Dimensions {
	return useMemo(
		() => ({
			width: column?.currentWidth || 0,
			height:
				column?.data?.compact && considerCompactMode
					? HISTOGRAM_HEADER_COMPACT_HEIGHT
					: HISTOGRAM_HEADER_HEIGHT,
		}),
		[column, considerCompactMode],
	)
}
