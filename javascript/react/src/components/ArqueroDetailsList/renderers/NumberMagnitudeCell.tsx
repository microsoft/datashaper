/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'

import { useCellDimensions, useFormattedNumber } from '../hooks/index.js'
import { getValue } from '../util/index.js'
import type { MagnitudeCellProps } from './types.js'
/**
 * Basic endering of number values.
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
		const barColor = useMemo(
			() => color || theme.rect().fill().hex(),
			[theme, color],
		)
		const value = getValue(item, column)
		const printed = useFormattedNumber(value, numberFormat)
		const dimensions = useCellDimensions(column)
		const { width, height } = dimensions
		const textFill = useMemo(() => theme.text().fill().hex(), [theme])
		const size = magnitude * width
		return (
			<div
				style={{
					textAlign,
				}}
			>
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
