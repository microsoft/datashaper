/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'
import { Sparkbar } from '../../charts'
import { useCellDimensions } from '../hooks'
import { ColumnCellChartProps } from './types'

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
