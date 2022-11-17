/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sparkbar } from '@essex/charts-react'
import { memo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { getValue } from '../ArqueroDetailsList.utils.js'
import { useCellDimensions } from '../hooks/index.js'
import type { ColumnCellChartProps } from './types.js'

/**
 * Renders an array-valued cell as a Sparkbar.
 */
export const SparkbarCell: React.FC<ColumnCellChartProps> = memo(
	function SparkbarCell({ item, column }) {
		const values = getValue(item, column) || EMPTY_ARRAY
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
