/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Subscription } from 'rxjs'

import { toposort } from '@essex/toposort'
import type { Graph, Node, NodeId } from './types.js'

export class DefaultGraph<T> implements Graph<T> {
	/**
	 * A mapping of NodeID to Node
	 */
	private _nodes: Map<NodeId, Node<T>> = new Map()

	/**
	 * A mapping of NodeID to Subscription for listening to node bindnigs
	 */
	private _nodeBindingSubscriptions: Map<NodeId, Subscription> = new Map()

	/**
	 * Clear the graph and remove all nodes
	 */
	public clear(): void {
		for (const sub of Object.values(this._nodeBindingSubscriptions)) {
			sub.unsubscribe()
		}
		this._nodeBindingSubscriptions.clear()
		this._nodes.clear()
	}

	/**
	 * Get a list of NodeIDs
	 */
	public get nodes(): NodeId[] {
		return [...this._nodes.keys()]
	}

	/**
	 * Check if the graph has a node with the given ID
	 * @param id - The node ID to check
	 * @returns Whether the graph has a node with the given ID
	 */
	public hasNode(id: NodeId): boolean {
		return this._nodes.has(id)
	}

	/**
	 * Get a node by id
	 * @param id - The node ID to retrieve
	 * @returns
	 */
	public node(id: NodeId): Node<T> {
		const result = this._nodes.get(id)
		if (!result) {
			throw new Error(`could not find node with id "${id}"`)
		}
		return result
	}

	/**
	 * Add a node to the graph
	 * @param node - The node to add to the graph
	 */
	public add(node: Node<T>): void {
		if (!this._nodes.has(node.id)) {
			this._nodes.set(node.id, node)

			// add the bound nodes
			for (const b of node.bindings) {
				this.add(b.node)
			}

			// when bindings change, add those nodes
			const subscription = node.bindings$.subscribe((bindings) => {
				for (const b of bindings) {
					this.add(b.node)
				}
			})
			this._nodeBindingSubscriptions.set(node.id, subscription)
		}
	}

	/**
	 * Remove a node by ID from the graph
	 * @param removeId - The node ID to remove
	 */
	public remove(removeId: NodeId): void {
		if (this.hasNode(removeId)) {
			// clear the node from any connections
			for (const innerNodeId of this._nodes.keys()) {
				const node = this._nodes.get(innerNodeId)
				for (const binding of node?.bindings ?? []) {
					if (binding.node.id === removeId) {
						node?.unbind(binding.input)
					}
				}
			}

			// remove the node internally
			this._nodes.delete(removeId)
			this._nodeBindingSubscriptions.delete(removeId)
		}
	}

	/**
	 * Validate the graph, checking for any cycles
	 */
	public validate(): void {
		// toposort will throw if a cycle is detected
		toposort<string>(this.edges)
	}

	/**
	 * Get the edges of the graph
	 */
	private get edges(): Array<[string, string]> {
		const edges: [string, string][] = []
		for (const id of this.nodes) {
			const node = this._nodes.get(id)
			if (node) {
				for (const b of node.bindings) {
					edges.push([b.node.id, id])
				}
			}
		}
		return edges
	}

	/**
	 * Print per-node stats of the graph
	 */
	public printStats(): void {
		const nodeInfo = [...this._nodes.values()]
			.map((n) => {
				const { id, version, recalculations, recalculationCauses } = n.stats
				return `  Node[${id}]: Version ${version}; ${recalculations} recalculations ${JSON.stringify(recalculationCauses)}`
			})
			.join('\n')
		console.log(`Graph Stats\n${nodeInfo}`)
	}
}
