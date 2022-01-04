/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { Case, Default, Switch } from 'react-if'
import { categories, getValue, isDistinctCategories } from '../util'
import { ArrayCell } from './ArrayCell'
import { RichCellProps } from './types'
import { SparkbarCell, CategoricalBarCell, SparklineCell } from './'

const HISTO_MAX = 20
/**
 * Chooses what sort of array display would be best.
 */
export const SmartArrayCell: React.FC<RichCellProps> = memo(
	function SmartArrayCell(props) {
		const { item, column } = props
		const values = getValue(item, column) || []
		const cellWidth = column?.currentWidth || 0
		const histo = categories(values)
		const histoLength = Object.keys(histo).length
		const dist = isDistinctCategories(histo)
		return (
			<Switch>
				<Case condition={values.length <= 3}>
					<ArrayCell {...props} />
				</Case>
				<Case condition={histoLength <= HISTO_MAX && !dist}>
					<CategoricalBarCell {...props} categories={histo} />
				</Case>
				{/* if bars can be at least one pixel, otherwise use a line */}
				<Case condition={values.length <= cellWidth}>
					<SparkbarCell {...props} />
				</Case>
				<Case condition={values.length > cellWidth}>
					<SparklineCell {...props} />
				</Case>
				<Default>
					<ArrayCell {...props} />
				</Default>
			</Switch>
		)
	},
)
