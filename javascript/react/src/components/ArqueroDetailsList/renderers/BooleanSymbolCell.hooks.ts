/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IColumn } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

import { getValue } from '../ArqueroDetailsList.utils.js'
import type { Dimensions } from './types.js'

export function useBooleanCircleAttrs(
	dimensions: Dimensions,
	item?: any,
	column?: IColumn,
): React.SVGProps<SVGCircleElement> {
	const theme = useThematic()
	return useMemo(() => {
		const value = !!getValue(item, column)
		const { width, height } = dimensions
		return {
			cx: width / 2,
			cy: height / 2,
			r: height / 4,
			fill: value ? theme.process().fill().hex() : 'none',
			stroke: theme.process().stroke().hex(),
		}
	}, [theme, dimensions, item, column])
}
