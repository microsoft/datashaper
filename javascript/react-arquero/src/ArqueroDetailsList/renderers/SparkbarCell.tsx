/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sparkbar } from '@data-wrangling-components/react-charts'
import { memo } from 'react'

import { useCellDimensions } from '../hooks/index.js'
import { getValue } from '../util/index.js'
import type { ColumnCellChartProps } from './types.js'

/**
 * Renders an array-valued cell as a Sparkbar.
 */
export const SparkbarCell: React.FC<ColumnCellChartProps> = memo(
	function SparkbarCell({ item, column }) {
		const values = getValue(item, column) || []
		const dimensions = useCellDimensions(column)
		return (
			<Sparkbar
				data={values}
				width={dimensions.width}
				height={dimensions.height}
			/>
		)
	},
)
