/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { line as themeLine } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { line } from 'd3-shape'
import { memo, useLayoutEffect, useMemo, useRef } from 'react'

import {
	useChartSVG,
	useIndexedScale,
	useNumericLinearScale,
	usePlotGroup,
} from '../hooks.js'

export interface SparklineProps {
	data: number[]
	width: number
	height: number
	color?: string
}

/**
 * Renders a basic Sparkline
 */
export const Sparkline: React.FC<SparklineProps> = memo(function Sparkline({
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

	const xScale = useIndexedScale(data, [0, width])
	const yScale = useNumericLinearScale(data, [0, height])

	useChartSVG(ref, width, height)
	const group = usePlotGroup(ref, width, height)

	const path = useMemo(() => {
		const gen = line(xScale, yScale)
		return gen(data)
	}, [data, xScale, yScale])

	useLayoutEffect(() => {
		if (group) {
			// clear the line if the data changes
			group.selectAll('*').remove()
			group
				.append('path')
				.call(themeLine as any, theme.line())
				.attr('d', path)
				.attr('stroke-width', 1)
				.attr('stroke', lineColor)
		}
	}, [theme, group, path, lineColor])
	return <svg ref={ref} />
})
