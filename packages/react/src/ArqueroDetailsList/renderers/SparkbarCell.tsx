/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IColumn } from '@fluentui/react'
import React, { memo } from 'react'
import { Sparkbar } from '../../charts'
import { useCellDimensions } from './hooks'

export interface SparkbarCellProps {
	item?: any
	index?: number
	column?: IColumn
}

/**
 * Renders an array-valued cell as a Sparkbar.
 */
export const SparkbarCell: React.FC<SparkbarCellProps> = memo(
	function SparkbarCell({ item, column }) {
		const values = (column?.fieldName && item[column.fieldName]) || []
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
