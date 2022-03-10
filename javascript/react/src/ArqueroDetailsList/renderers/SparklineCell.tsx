/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { Sparkline } from '../../charts/index.js'
import { useCellDimensions } from '../hooks/index.js'
import { getValue } from '../util/index.js'
import type { ColumnCellChartProps } from './types.js'

/**
 * Renders an array-valued cell as a sparkline.
 */
export const SparklineCell: React.FC<ColumnCellChartProps> = memo(
	function SparklineCell({ item, column, color }) {
		const values = getValue(item, column) || []
		const dimensions = useCellDimensions(column)
		return (
			<Sparkline
				data={values}
				width={dimensions.width}
				height={dimensions.height}
				color={color}
			/>
		)
	},
)
