/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sparkbar } from '@essex/charts-react'
import { memo } from 'react'

import { emptyObject } from '../../../empty.js'
import { useCellDimensions } from '../hooks/index.js'
import { useValues } from './CategoricalBarCell.hooks.js'
import type { ColumnCellChartProps } from './types.js'

/**
 * Renders an array-valued cell as a CategoricalBar.
 */
export const CategoricalBarCell: React.FC<ColumnCellChartProps> = memo(
	function CategoricalBarCell({
		column,
		categories = emptyObject<ColumnCellChartProps['categories']>(),
	}) {
		const values = useValues(categories)
		const dimensions = useCellDimensions(column)
		return (
			<Sparkbar
				data={values}
				categorical
				width={dimensions.width}
				height={dimensions.height}
			/>
		)
	},
)
