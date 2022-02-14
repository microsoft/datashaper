/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Sparkbar } from '../../charts'
import { useCellDimensions } from '../hooks'
import { getValue } from '../util'
import { ColumnCellChartProps } from './types'

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
