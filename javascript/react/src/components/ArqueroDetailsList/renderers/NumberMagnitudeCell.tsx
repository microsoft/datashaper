/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'

import { getValue } from '../ArqueroDetailsList.utils.js'
import { useCellDimensions, useFormattedNumber } from '../hooks/index.js'
import { useTextAlignStyle } from './hooks.js'
import { useBarColor } from './NumberMagnitudeCell.hooks.js'
import type { MagnitudeCellProps } from './types.js'
/**
 * Basic rendering of number values.
 */
export const NumberMagnitudeCell: React.FC<MagnitudeCellProps> = memo(
	function NumberMagnitudeCell({
		item,
		column,
		textAlign = 'right',
		numberFormat,
		color,
		magnitude = 0,
	}) {
		const theme = useThematic()
		const barColor = useBarColor(color)
		const value = getValue(item, column)
		const printed = useFormattedNumber(value, numberFormat)
		const dimensions = useCellDimensions(column)
		const { width, height } = dimensions
		const textFill = useMemo(() => theme.text().fill().hex(), [theme])
		const size = magnitude * width
		const style = useTextAlignStyle(textAlign, overrides)

		return (
			<div style={style}>
				<svg width={width} height={height}>
					<rect width={size} height={height} x={width - size} fill={barColor} />
					<text
						fill={textFill}
						y={height / 2 + 1}
						x={width - 2}
						dominantBaseline={'middle'}
						textAnchor={'end'}
					>
						{printed}
					</text>
				</svg>
			</div>
		)
	},
)

// centers the svg vertically
const overrides = {
	paddingTop: 7,
	paddingBottom: 5,
}
