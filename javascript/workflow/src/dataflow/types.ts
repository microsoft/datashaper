/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

import type { Maybe } from './../primitives.js'

export type NodeId = string
export type SocketName = string | symbol
export type VariadicNodeBinding<T> = Omit<NodeBinding<T>, 'input'>[]

/**
 * A graph processing node
 * @public
 */
export interface Node<T, Config = unknown> {
	/**
	 * A unique identifier for this node
	 */
	readonly id: NodeId

	/**
	 * Named input sockets
	 */
	readonly inputs: SocketName[]

	/**
	 * The node's mutable configuration
	 */
	config: Maybe<Config>

	/**
	 * A configuration observable
	 */
	readonly config$: Observable<Maybe<Config>>

	/**
	 * Gets all input bindings
	 */
	readonly bindings: NodeBinding<T>[]

	/**
	 * An observable of the input bindings
	 */
	readonly bindings$: Observable<NodeBinding<T>[]>

	/**
	 * Binds an input socket to an upstream node
	 * @param binding - the node binding to apply. If an array, binds variadic input
	 */
	bind(binding: NodeBinding<T> | VariadicNodeBinding<T>): void

	/**
	 * Clear an input socket
	 * @param name - The input socket name
	 */
	unbind(name?: SocketName): void

	/**
	 * Retrieves an existing input binding by id
	 */
	binding(input?: SocketName): Maybe<NodeBinding<T>>

	/**
	 * Gets the output value stream
	 */
	readonly output$: Observable<Maybe<T>>

	/**
	 * Gets a current output value
	 */
	readonly output: Maybe<T>

	/**
	 * The diagnostic statistics for this node
	 */
	readonly stats: NodeStats
}


/**
 * An interface for node statistics.
 */
export interface NodeStats {
	/**
	 * The unique identifier for this node
	 */
	id: NodeId

	/**
	 * The number of times this node's value has changed
	 */
	version: number

	/**
	 * The number of times this node has been recalculated
	 */
	recalculations: number

	/**
	 * Specific causes of recalculations
	 */
	recalculationCauses: Record<string, number>
}

/**
 * A binding for a value being emitted from a node
 */
export interface NodeBinding<T> {
	/**
	 * The source node to bind data from
	 */
	node: Node<T>

	/**
	 * The named input on the target node (otherwise default)
	 */
	input?: SocketName
}

export interface Graph<T> {
	readonly nodes: NodeId[]

	/**
	 * Determines if the graph contains a node by id
	 * @param id - The node id
	 */
	hasNode(id: NodeId): boolean

	/**
	 * Retrieves a node by id.
	 * @param id - the node identifier
	 * @throws - if the id is not found
	 */
	node(id: NodeId): Node<T>

	/**
	 * Verify that the graph is a valid dag (no cycles)
	 * @throws - if graph is cyclic
	 */
	validate(): void

	/**
	 * Add a node to the graph
	 * @param node - The node to register with the graph
	 */
	add(node: Node<T>): void

	/**
	 * Remove a node from the grpah
	 */
	remove(id: NodeId): void

	/**
	 * Clears out the graph of all nodes, inputs, and outputs
	 */
	clear(): void
}

export enum NodeInput {
	Source = 'source',
	Other = 'other',
}

export enum NodeOutput {
	Target = 'target',
}
