/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Subscription } from 'rxjs'

import toposort from '@essex/toposort'
import type { Graph, Node, NodeId } from './types.js'

export class DefaultGraph<T> implements Graph<T> {
	private _nodes: Map<NodeId, Node<T>> = new Map()
	private _nodeSubscriptions: Map<NodeId, Subscription> = new Map()

	public clear(): void {
		for (const sub of Object.values(this._nodeSubscriptions)) {
			sub.unsubscribe()
		}
		this._nodeSubscriptions.clear()
		this._nodes.clear()
	}

	/**
	 * Get a list of NodeIDs
	 */
	public get nodes(): NodeId[] {
		return [...this._nodes.keys()]
	}

	public hasNode(id: NodeId): boolean {
		return this._nodes.has(id)
	}

	public node(id: NodeId): Node<T> {
		const result = this._nodes.get(id)
		if (!result) {
			throw new Error(`could not find node with id "${id}"`)
		}
		return result
	}

	public add(node: Node<T>): void {
		if (!this._nodes.has(node.id)) {
			this._nodes.set(node.id, node)

			// add the bound nodes
			node.bindings.forEach((b) => this.add(b.node))

			// when bindings change, add those nodes
			const subscription = node.bindings$.subscribe((bindings) =>
				bindings.forEach((b) => this.add(b.node)),
			)
			this._nodeSubscriptions.set(node.id, subscription)
		}
	}

	public remove(removeId: NodeId): void {
		if (this.hasNode(removeId)) {
			// clear the node from any connections
			for (const innerNodeId of this._nodes.keys()) {
				const node = this._nodes.get(innerNodeId)
				if (node) {
					for (const binding of node?.bindings || []) {
						if (binding.node.id === removeId) {
							node?.unbind(binding.input)
						}
					}
				}
			}

			// remove the node internally
			this._nodes.delete(removeId)
			this._nodeSubscriptions.delete(removeId)
		}
	}

	public validate(): void {
		// toposort will throw if a cycle is detected
		toposort<string>(this.edges)
	}

	private get edges(): Array<[string, string]> {
		const edges: [string, string][] = []
		this.nodes.forEach((id) => {
			const node = this._nodes.get(id)
			if (node) {
				node.bindings.forEach((binding) => {
					edges.push([binding.node.id, id])
				})
			}
		})
		return edges
	}

	public printStats(): void {
		const log = "Graph Stats\n" + [...this._nodes.values()].map(n => {
			const {id, version, recalculations, recalculationCauses } = n.stats
			return `  Node[${id}]: Version ${version}; ${recalculations} recalculations ${JSON.stringify(recalculationCauses)}`
		}).join("\n")
		console.log(log)
	}
}
