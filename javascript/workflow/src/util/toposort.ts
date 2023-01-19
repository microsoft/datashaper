/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/**
 * Toposort an edge list
 * @param edges - the edge list
 * @returns the topologically sorted node array
 */
export default function toposort<T = string>(
	edges: ReadonlyArray<[T, T | undefined]>,
): T[] {
	return array(uniqueNodes(edges), edges)
}

/**
 *
 * @param nodes - the nodes array
 * @param edges - the edges array
 * @returns the topologically sorted node array
 */
export function array<T = string>(
	nodes: ReadonlyArray<T>,
	edges: ReadonlyArray<[T, T | undefined]>,
): T[] {
	let cursor = nodes.length
	let i = cursor
	const sorted = new Array(cursor)
	const visited: Record<number, boolean> = {}
	// Better data structures make algorithm much faster.
	const outgoingEdges = makeOutgoingEdges(edges)
	const nodesHash = makeNodesHash(nodes)

	// check for unknown nodes
	edges.forEach(function (edge) {
		if (!(nodesHash.has(edge[0]!) && nodesHash.has(edge[1]!))) {
			throw new Error(
				'Unknown node. There is an unknown node in the supplied edges.',
			)
		}
	})

	while (i--) {
		if (!visited[i]) visit(nodes[i]!, i, new Set())
	}

	return sorted

	function visit(node: T, i: number, predecessors: Set<T>) {
		if (predecessors.has(node)) {
			let nodeRep
			try {
				nodeRep = `, node was:${JSON.stringify(node)}`
			} catch (e) {
				nodeRep = ''
			}
			throw new Error(`Cyclic dependency${nodeRep}`)
		}

		if (!nodesHash.has(node)) {
			throw new Error(
				`Found unknown node. Make sure to provided all involved nodes. Unknown node: ${JSON.stringify(
					node,
				)}`,
			)
		}

		if (visited[i]) return
		visited[i] = true

		const outgoingSet = outgoingEdges.get(node) || new Set<T>()
		const outgoing = Array.from(outgoingSet)

		if ((i = outgoing.length)) {
			predecessors.add(node)
			do {
				const child = outgoing[--i]!
				visit(child, nodesHash.get(child)!, predecessors)
			} while (i)
			predecessors.delete(node)
		}

		sorted[--cursor] = node
	}
}

function uniqueNodes<T>(arr: ReadonlyArray<[T, T | undefined]>): T[] {
	const res = new Set<T>()
	for (let i = 0, len = arr.length; i < len; i++) {
		const edge = arr[i]!
		res.add(edge[0]!)
		res.add(edge[1]!)
	}
	return Array.from(res)
}

function makeOutgoingEdges<T>(
	arr: ReadonlyArray<[T, T | undefined]>,
): Map<T, Set<T>> {
	const edges = new Map<T, Set<T>>()
	for (let i = 0, len = arr.length; i < len; i++) {
		const edge = arr[i]!
		if (!edges.has(edge[0]!)) edges.set(edge[0]!, new Set())
		if (!edges.has(edge[1]!)) edges.set(edge[1]!, new Set())
		edges.get(edge[0]!)!.add(edge[1]!)
	}
	return edges
}

function makeNodesHash<T>(arr: ReadonlyArray<T>): Map<T, number> {
	const res = new Map<T, number>()
	for (let i = 0, len = arr.length; i < len; i++) {
		res.set(arr[i]!, i)
	}
	return res
}
