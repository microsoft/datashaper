/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IColumn } from '@fluentui/react'
import React, { memo } from 'react'
import { Sparkline } from '../../charts'
import { useCellDimensions } from './hooks'

export interface SparklineCellProps {
	item?: any
	index?: number
	column?: IColumn
}

/**
 * Renders an array-valued cell as a sparkline.
 */
export const SparklineCell: React.FC<SparklineCellProps> = memo(
	function SparklineCell({ item, column }) {
		const values = (column?.fieldName && item[column.fieldName]) || []
		const dimensions = useCellDimensions(column)
		return (
			<Sparkline
				data={values}
				width={dimensions.width}
				height={dimensions.height}
			/>
		)
	},
)
