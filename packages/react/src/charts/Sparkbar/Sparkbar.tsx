/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { line as themeLine } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { isArray } from 'lodash'

import React, { memo, useLayoutEffect, useMemo, useRef } from 'react'
import {
	useChartSVG,
	useIndexedScale,
	useNumericLinearScale,
	usePlotGroup,
} from '../hooks'

export interface SparkbarProps {
	data: number[]
	width: number
	height: number
	categorical?: boolean
	color?: string | string[]
}

/**
 * Renders a basic Sparkbar. This is a Sparkline-style bar chart.
 */
export const Sparkbar: React.FC<SparkbarProps> = memo(function Sparkbar({
	data,
	width,
	height,
	categorical = false,
	color,
}) {
	const theme = useThematic()
	const ref = useRef(null)

	const colors = useMemo(() => {
		if (categorical) {
			if (isArray(color)) {
				return color
			} else {
				return theme.scales().nominal(data.length).toArray()
			}
		}
		return color || theme.line().stroke().hex()
	}, [theme, data, color, categorical])

	// subtracting a small amount from the width ensures we have at least a small amount of gap
	const barWidth = useMemo(
		() => Math.floor((width - 4) / data.length),
		[data, width],
	)

	const xScale = useIndexedScale(data, [barWidth / 2, width - barWidth / 2])
	// two pixels off the height means min values will still have slight visibility
	const yScale = useNumericLinearScale(data, [0, height - 2])

	useChartSVG(ref, width, height)
	const group = usePlotGroup(ref, width, height)

	useLayoutEffect(() => {
		if (group) {
			// clear the line if the data changes
			group.selectAll('*').remove()
			group
				.selectAll('.bar')
				.data(data)
				.enter()
				.append('line')
				.attr('class', 'bar')
				.attr('x1', xScale)
				.attr('x2', xScale)
				.attr('y1', yScale)
				.attr('y2', height)
				.call(themeLine as any, theme.line())
				.attr('stroke-width', barWidth)
				.attr('stroke', (d, i) => (categorical ? colors[i] : colors))
		}
	}, [
		theme,
		group,
		data,
		height,
		xScale,
		yScale,
		colors,
		categorical,
		barWidth,
	])
	return <svg ref={ref} />
})
