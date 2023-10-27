/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Case, Default, Switch } from 'react-if'

import { EMPTY_ARRAY } from '../../../empty.js'
import {
	categories,
	getValue,
	isDistinctCategories,
} from '../ArqueroDetailsList.utils.js'
import { ArrayCell } from './ArrayCell.js'
import { ArrayDropdownCell } from './ArrayDropdownCell.js'
import { CategoricalBarCell, SparkbarCell, SparklineCell } from './index.js'
import type { RichCellProps } from './types.js'

const HISTOGRAM_MAX = 20
const DROPDOWN_MAX = 15
/**
 * Chooses what sort of array display would be best.
 */
export const SmartArrayCell: React.FC<RichCellProps> = memo(
	function SmartArrayCell(props) {
		const { item, column, index } = props
		const values = getValue(item, column) || EMPTY_ARRAY
		const cellWidth = column?.currentWidth || 0
		const histogram = categories(values) as Record<string, number>
		const histogramLength = Object.keys(histogram).length
		const dist = isDistinctCategories(histogram)
		return (
			<Switch>
				<Case condition={values.length <= 3}>
					<ArrayCell {...props} />
				</Case>
				<Case condition={values.length <= DROPDOWN_MAX}>
					<ArrayDropdownCell rowIndex={index || 0} {...props} />
				</Case>
				<Case condition={histogramLength <= HISTOGRAM_MAX && !dist}>
					<CategoricalBarCell {...props} categories={histogram} />
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
