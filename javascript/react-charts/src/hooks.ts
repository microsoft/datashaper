/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { chart, plotArea } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { scaleLinear } from 'd3-scale'
import type { Selection } from 'd3-selection'
import { select } from 'd3-selection'
import { useLayoutEffect, useMemo, useState } from 'react'

export type ScaleFunction = (d: any, i: number) => number
/**
 * Creates a basic linear scale for use with d3.
 * Assumed items are ordered and uses the array index for
 * domain position.
 * @param length
 * @param range
 * @returns
 */
export function useIndexedScale(
	values: unknown[],
	range: [number, number],
): ScaleFunction {
	const linear = useMemo(
		() =>
			scaleLinear()
				.domain([0, values.length - 1])
				.range(range)
				.clamp(true),
		[values, range],
	)
	return useMemo(() => (_d: any, i: number) => linear(i), [linear])
}

/**
 * Creates a basic linear scale for use with d3.
 * Scales linearly from the numeric values using full extent.
 * @param values
 * @param range
 * @returns
 */
export function useNumericLinearScale(
	values: number[],
	range: [number, number],
): ScaleFunction {
	const extent = useMemo(
		() => [Math.min(...values), Math.max(...values)],
		[values],
	)
	const linear = useMemo(
		() => scaleLinear().domain(extent).range(range),
		[extent, range],
	)
	return useMemo(() => {
		// if there is no variation, just fill the space
		if (extent[0] === extent[1]) {
			return () => range[1]
		}
		return (d: any) => linear(d)
	}, [linear, extent, range])
}

/**
 * Apply thematic to an SVG.
 * @param svgRef
 * @param width
 * @param height
 */
export function useChartSVG(
	svgRef: React.MutableRefObject<null>,
	width: number,
	height: number,
): void {
	const theme = useThematic()
	useLayoutEffect(() => {
		select(svgRef.current).call(chart as any, theme, {
			width: width < 0 ? 0 : width,
			height: height < 0 ? 0 : height,
		})
	}, [theme, svgRef, width, height])
}

/**
 * Creates a plot area group with default thematic visuals
 * @param svgRef
 * @param width
 * @param height
 * @returns
 */
export function usePlotGroup(
	svgRef: React.MutableRefObject<null>,
	width: number,
	height: number,
): Selection<Element, any, Element, any> | undefined {
	const theme = useThematic()
	const [group, setGroup] = useState<
		Selection<any, any, any, any> | undefined
	>()
	useLayoutEffect(() => {
		const g = select(svgRef.current)
			.append('g')
			.call(plotArea as any, theme)
			.append('g')
		setGroup(g)
	}, [theme, svgRef, width, height])
	return group
}
