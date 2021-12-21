/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { line as themeLine } from '@thematic/d3'
import { useThematic } from '@thematic/react'

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
	color?: string
}

/**
 * Renders a basic Sparkbar
 */
export const Sparkbar: React.FC<SparkbarProps> = memo(function Sparkbar({
	data,
	width,
	height,
	color,
}) {
	const theme = useThematic()
	const ref = useRef(null)

	const lineColor = useMemo(() => {
		return color || theme.line().stroke().hex()
	}, [theme, color])

	const barWidth = useMemo(() => Math.floor(width / data.length), [data, width])

	const xScale = useIndexedScale(data, [barWidth / 2, width - barWidth / 2])
	const yScale = useNumericLinearScale(data, [0, height])

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
				.attr('stroke', lineColor)
		}
	}, [theme, group, data, height, xScale, yScale, lineColor, barWidth])
	return <svg ref={ref} />
})
