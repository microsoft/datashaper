/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { CartesianPointBindings } from '@datashaper/workflow'
import { useCallback, useMemo } from 'react'
import { useObservableState } from 'observable-hooks'
import { scaleLinear } from 'd3-scale'
import Graph from 'graphology'

export function useGraph(
	nodesTable: ColumnTable,
	nodeBindings: CartesianPointBindings,
): Graph {
	const nodes = useNodes(nodesTable, nodeBindings)
	return useMemo(() => {
		const graph = new Graph()
		nodes.forEach((node) => {
			graph.addNode(node.id, node)
		})
		return graph
	}, [nodes])
}

function useNodes(table: ColumnTable, nodeBindings: CartesianPointBindings) {
	const x = useXBinding(nodeBindings)
	const y = useYBinding(nodeBindings)
	const size = useSizeBinding(nodeBindings)
	return useMemo(() => {
		const nodes = table.objects()
		return nodes.map((node) => ({
			...node,
			x: x(node),
			y: y(node),
			size: size(node),
		}))
	}, [table, x, y, size])
}

function useXBinding(nodeBindings: CartesianPointBindings) {
	const field = useObservableState(nodeBindings.x.field$, nodeBindings.x.field)
	return useCallback((node: any) => (field ? node[field] : 0), [field])
}

function useYBinding(nodeBindings: CartesianPointBindings) {
	const field = useObservableState(nodeBindings.y.field$, nodeBindings.y.field)
	return useCallback((node: any) => (field ? node[field] : 0), [field])
}

function useSizeBinding(nodeBindings: CartesianPointBindings) {
	const field = useObservableState(
		nodeBindings.size.field$,
		nodeBindings.size.field,
	)
	const domain = useObservableState(
		nodeBindings.size.domain$,
		nodeBindings.size.domain,
	)
	const range = useObservableState(
		nodeBindings.size.range$,
		nodeBindings.size.range,
	)
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
