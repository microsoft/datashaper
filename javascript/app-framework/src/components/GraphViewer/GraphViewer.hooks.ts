/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type {
	CartesianPointBindings,
	CartesianLineBindings,
	DataGraphNodes,
	DataGraphEdges,
} from '@datashaper/workflow'
import { useCallback, useMemo } from 'react'
import { useObservableState } from 'observable-hooks'
import { scaleLinear } from 'd3-scale'
import Graph from 'graphology'
import { useThematic } from '@thematic/react'
import { op } from 'arquero'

// temp
interface GraphNode {
	id: string
	x: number
	y: number
	size: number
	color: string
}
interface GraphEdge {
	id: string
	source: string
	target: string
	size: number
	color: string
}

export function useGraph(
	nodesTable: ColumnTable,
	edgesTable: ColumnTable,
	nodesDefinition: DataGraphNodes,
	edgesDefinition: DataGraphEdges,
	edgeProportion?: number,
): Graph {
	const nodes = useNodes(nodesTable, nodesDefinition)
	const edges = useEdges(edgesTable, nodes, edgesDefinition, edgeProportion)
	return useMemo(() => {
		const graph = new Graph()
		// NOTE: graphology nodes must have an id, and edges must have a source and target (which map to node ids)
		// they enforce this via independent required args on the addNode and addEdge methods, with the additional arg being the remaining
		// node or edge properties such as size and color.
		// our hooks return node and edge objects with all required properties, including the rendering options supported by sigma.
		// Also note: sigma will throw if a duplicate node id is used, but duplicate edges are fine.
		nodes.forEach((node) => {
			// the graphology types are goofy, this method does exist in `graph`
			;(graph as any).addNode(node.id, node)
		})
		edges.forEach((edge) => {
			// the graphology types are goofy, this method does exist in `graph`
			;(graph as any).addEdge(edge.source, edge.target, edge)
		})
		return graph
	}, [nodes, edges])
}

function useNodes(table: ColumnTable, definition: DataGraphNodes): GraphNode[] {
	const id = useNodeId(definition)
	const x = useXBinding(definition.bindings)
	const y = useYBinding(definition.bindings)
	const size = useSizeBinding(definition.bindings)
	const fill = useFillBinding(definition.bindings, table)
	const nodes = useMemo(() => {
		const raw = table.objects()
		return raw.map((node) => ({
			id: id(node),
			x: parseFloat(x(node)), // TEMP: this is due to arquero csv serialization
			y: parseFloat(y(node)),
			size: size(node),
			color: fill(node),
		}))
	}, [table, id, x, y, size, fill])
	return useMemo(() => {
		// filter any invalid nodes, which can be caused by unmapped or mis-mapped columns
		return nodes.filter((node) => node.id !== undefined)
	}, [nodes])
}

function useEdges(
	table: ColumnTable,
	nodes: GraphNode[],
	definition: DataGraphEdges,
	proportion = 0,
): GraphEdge[] {
	const id = useEdgeId(definition)
	const source = useEdgeSource(definition)
	const target = useEdgeTarget(definition)
	const width = useWidthBinding(definition.bindings)
	const stroke = useStrokeBinding(definition.bindings)
	const edges = useMemo(() => {
		const raw = table
			? table.sample(table.numRows() * proportion).objects()
			: []
		return raw.map((edge) => ({
			id: id(edge),
			source: source(edge),
			target: target(edge),
			size: width(edge),
			color: stroke(edge),
		}))
	}, [table, id, source, target, width, stroke, proportion])
	return useMemo(() => {
		// filter any invalid edges, which can be caused by unmapped or mis-mapped columns
		const hash = nodes.reduce((acc: Record<string, boolean>, node) => {
			acc[node.id] = true
			return acc
		}, {})
		return edges.filter(
			(edge) =>
				hash[edge.source] && hash[edge.target] && edge.source !== edge.target,
		)
	}, [nodes, edges])
}

// NOTE: this is not actually necessary for sigma, but is for graspologic once we migrate.
function useEdgeId(definition: DataGraphEdges) {
	const identifier = useObservableState(
		definition.identifier$,
		definition.identifier,
	)
	const source = useEdgeSource(definition)
	const target = useEdgeTarget(definition)
	return useCallback(
		(edge: any) =>
			identifier ? edge[identifier] : `${source(edge)}--${target(edge)}`,
		[identifier, source, target],
	)
}

function useEdgeSource(definition: DataGraphEdges) {
	const source = useObservableState(definition.source$, definition.source)
	return useCallback((edge: any) => (source ? edge[source] : ''), [source])
}

function useEdgeTarget(definition: DataGraphEdges) {
	const target = useObservableState(definition.target$, definition.target)
	return useCallback((edge: any) => (target ? edge[target] : ''), [target])
}

// TODO: this will eventually have a variety of binding options instead of being a static color
function useStrokeBinding(bindings: CartesianLineBindings) {
	const theme = useThematic()
	const stroke = useObservableState(bindings.stroke$, bindings.stroke)
	return useCallback(
		(_edge: any) => (stroke ? stroke : theme.link().stroke().hex()),
		[theme, stroke],
	)
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

function useNodeId(definition: DataGraphNodes) {
	const identifier = useObservableState(
		definition.identifier$,
		definition.identifier,
	)
	return useCallback(
		(node: any) => identifier && node[identifier],
		[identifier],
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
	const theme = useThematic()
	const field = useObservableState(bindings.fill.field$, bindings.fill.field)
	const scale = useObservableState(bindings.fill.scale$, bindings.fill.scale)
	const fn = useThematicColorScale(scale || 'nominal', table, field)
	return useCallback(
		(node: any) => (field ? fn(node[field]).hex() : theme.node().fill().hex()),
		[field, fn, theme],
	)
}

function useThematicColorScale(
	name: string,
	table: ColumnTable,
	field?: string,
) {
	const uniques = useMemo(() => {
		if (field && table.column(field)) {
			const rollup = table
				.rollup({
					uniques: op.distinct(field),
				})
				.objects()
			return (rollup[0] as any)?.uniques || 1
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
				// TODO: thematic should have a scales.static option that just returns the default node fill
				// this would allow greater plug-and-play when a function is always required
				return scales.nominal(uniques)
		}
	}, [theme, name, uniques])
}
