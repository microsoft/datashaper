/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type {
	CartesianPointBindings,
	CartesianLineBindings,
} from '@datashaper/workflow'
import { useCallback, useMemo } from 'react'
import { useObservableState } from 'observable-hooks'
import { scaleLinear } from 'd3-scale'
import Graph from 'graphology'
import { useThematic } from '@thematic/react'
import { op } from 'arquero'

export function useGraph(
	nodesTable: ColumnTable,
	edgesTable: ColumnTable,
	nodeBindings: CartesianPointBindings,
	edgeBindings: CartesianLineBindings,
	edgeProportion?: number,
): Graph {
	const nodes = useNodes(nodesTable, nodeBindings)
	const edges = useEdges(edgesTable, edgeBindings, edgeProportion)
	return useMemo(() => {
		const graph = new Graph()
		nodes.forEach((node) => {
			graph.addNode(node.id, node)
		})
		edges.forEach((edge) => {
			graph.addEdge(edge.source, edge.target, edge)
		})
		return graph
	}, [nodes, edges])
}

function useNodes(table: ColumnTable, bindings: CartesianPointBindings) {
	const x = useXBinding(bindings)
	const y = useYBinding(bindings)
	const size = useSizeBinding(bindings)
	const fill = useFillBinding(bindings, table)
	return useMemo(() => {
		const nodes = table.objects()
		return nodes.map((node) => ({
			...node,
			x: x(node),
			y: y(node),
			size: size(node),
			color: fill(node),
		}))
	}, [table, x, y, size, fill])
}

function useEdges(table: ColumnTable, bindings: CartesianLineBindings, proportion = 0) {
	const width = useWidthBinding(bindings)
	const stroke = useStrokeBinding(bindings)
	return useMemo(() => {
		const edges = table.sample(table.numRows() * proportion).objects()
		return edges.map((edge) => ({
			...edge,
			type: 'line',
			size: width(edge),
			color: stroke(edge),
		}))
	}, [table, width, stroke, proportion])
}

function useStrokeBinding(bindings: CartesianLineBindings) {
	const stroke = useObservableState(bindings.stroke$, bindings.stroke)
	return useCallback((edge: any) => (stroke ? stroke : '#ccc'), [stroke])
}

function useWidthBinding(bindings: CartesianLineBindings) {
	const field = useObservableState(bindings.width.field$, bindings.width.field)
	const domain = useObservableState(
		bindings.width.domain$,
		bindings.width.domain,
	)
	const range = useObservableState(bindings.width.range$, bindings.width.range)
	const scale = useMemo(
		() =>
			scaleLinear()
				.domain(domain || [0, 1])
				.range(range || [1, 10]),
		[domain, range],
	)
	return useCallback(
		(edge: any) => {
			return field ? scale(edge[field]) : 1
		},
		[field, scale],
	)
}

function useXBinding(bindings: CartesianPointBindings) {
	const field = useObservableState(bindings.x.field$, bindings.x.field)
	return useCallback((node: any) => (field ? node[field] : 0), [field])
}

function useYBinding(bindings: CartesianPointBindings) {
	const field = useObservableState(bindings.y.field$, bindings.y.field)
	return useCallback((node: any) => (field ? node[field] : 0), [field])
}

function useSizeBinding(bindings: CartesianPointBindings) {
	const field = useObservableState(bindings.size.field$, bindings.size.field)
	const domain = useObservableState(bindings.size.domain$, bindings.size.domain)
	const range = useObservableState(bindings.size.range$, bindings.size.range)
	const scale = useMemo(
		() =>
			scaleLinear()
				.domain(domain || [0, 1])
				.range(range || [1, 10]),
		[domain, range],
	)
	return useCallback(
		(node: any) => {
			return field ? scale(node[field]) : 2
		},
		[field, scale],
	)
}

function useFillBinding(bindings: CartesianPointBindings, table: ColumnTable) {
	const field = useObservableState(bindings.fill.field$, bindings.fill.field)
	const scale = useObservableState(bindings.fill.scale$, bindings.fill.scale)
	const fn = useThematicColorScale(scale, table, field)
	return useCallback(
		(node: any) => (field ? fn(node[field]).hex() : '#ccc'),
		[field, fn],
	)
}

function useThematicColorScale(
	name: string,
	table: ColumnTable,
	field: string,
) {
	const uniques = useMemo(() => {
		if (field) {
			return table
				.rollup({
					uniques: op.distinct(field),
				})
				.objects()[0].uniques
		}
		return 1
	}, [table, field])
	const theme = useThematic()
	return useMemo(() => {
		const scales = theme.scales()
		switch (name) {
			case 'nominalMuted':
				return scales.nominalMuted(uniques)
			case 'nominalBold':
				return scales.nominalBold(uniques)
			// case 'sequential':
			// 	return scales.sequential(domain, scaleType)
			// case 'sequential2':
			// 	return scales.sequential2(domain, scaleType)
			// case 'diverging':
			// 	return scales.diverging(domain, scaleType)
			// case 'diverging2':
			// 	return scales.diverging2(domain, scaleType)
			// case 'greys':
			// 	return scales.greys(domain, scaleType)
			default:
				return scales.nominal(uniques)
		}
	}, [theme, name, uniques])
}
