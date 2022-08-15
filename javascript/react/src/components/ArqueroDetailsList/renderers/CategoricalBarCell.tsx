/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sparkbar } from '@essex/charts-react'
import { memo, useMemo } from 'react'

import { useCellDimensions } from '../hooks/index.js'
import type { ColumnCellChartProps } from './types.js'

/**
 * Renders an array-valued cell as a CategoricalBar.
 */
export const CategoricalBarCell: React.FC<ColumnCellChartProps> = memo(
	function CategoricalBarCell({ column, categories = {} }) {
		const values = useMemo(() => Object.values(categories), [categories])
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
