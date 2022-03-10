/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { line as themeLine } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import isArray from 'lodash-es/isArray.js'
import { memo, useLayoutEffect, useMemo, useRef } from 'react'

import {
	useChartSVG,
	useIndexedScale,
	useNumericLinearScale,
	usePlotGroup,
} from '../hooks.js'

export interface SparkbarProps {
	data: number[]
	width: number
	height: number
	categorical?: boolean
	color?: string | string[]
	legend?: string[]
	onBarHover?: (event: MouseEvent) => void
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
	legend,
	onBarHover,
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
	// one pixel off the height means min values will still have slight visibility
	// so the user knows something is there
	const yScale = useNumericLinearScale(data, [height - 1, 0])

	useChartSVG(ref, width, height)
	const group = usePlotGroup(ref, width, height)

	useLayoutEffect(() => {
		if (group) {
			// clear the line if the data changes
			group.selectAll('*').remove()
			group
				.selectAll('.bar-group')
				.data(data)
				.enter()
				.append('g')
				.attr('class', 'bar-group')
				.append('line')
				.attr('class', 'bar')
				.attr('x1', xScale)
				.attr('x2', xScale)
				.attr('y1', yScale)
				.attr('y2', height)
				.call(themeLine as any, theme.line())
				.attr('stroke-width', barWidth)
				.attr('stroke', (_d, i) => (categorical ? colors[i] ?? null : colors))
				.attr('data-legend', (d, i) => (legend?.length ? legend[i] ?? null : d))
				.attr('data-index', (_d, i) => i)
				.attr(
					'id',
					(d, i) => `bar-${i}-${d}-${Math.round(Math.random() * 100)}`,
				)
			// Alternative to onBarHover tooltip
			if (!onBarHover) {
				group
					.selectAll('.bar-group')
					.append('title')
					.text((d, i) => (legend?.length ? legend[i] ?? null : (d as string)))
			} else {
				group.selectAll('.bar').on('mouseover mouseout', onBarHover)
			}
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
		legend,
		onBarHover,
	])
	return <svg ref={ref} />
})
