/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

import type { Maybe } from '../primitives.js'

export type NodeId = string
export type SocketName = string | symbol

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
	 * The node's mutable configuration
	 */
	config: Maybe<Config>

	/**
	 * Named input sockets
	 */
	readonly inputs: SocketName[]

	/**
	 * Named output sockets, in addition to the implicit default output socket
	 */
	readonly outputs: SocketName[]

	/**
	 * Binds an input socket to an upstream node
	 * @param name - the name of the input socket
	 */
	bind(binding: NodeBinding<T>): void

	/**
	 * Binds variadic innput
	 * @param bindings
	 */
	bindVariadic(bindings: Omit<NodeBinding<T>, 'input'>[]): void

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
	 * Gets all input bindings
	 */
	bindings(): NodeBinding<T>[]

	/**
	 * The number of bound inputs
	 */
	readonly bindingsCount: number

	/**
	 * Gets an output socket
	 * @param name - The name of the output socket. If undefined, this will use the implicit default output socket.
	 */
	output(name?: SocketName): Observable<Maybe<T>>

	/**
	 * Gets a current output value
	 * @param name - The output name. If undefined, this will use the implicit default output socket.
	 */
	outputValue(name?: SocketName): Maybe<T>

	/**
	 *
	 * @param handler The event handler for when the binding changes
	 */
	readonly onBindingsChanged: Observable<void>
}

/**
 * A binding for a value being emitted from a node
 */
export interface NodeBinding<T> {
	/**
	 * The node to bind
	 */
	node: Node<T>

	/**
	 * The named input on the target node (otherwise default)
	 */
	input?: SocketName

	/**
	 * The named output on the source node (otherwise default)
	 */
	output?: SocketName
}

export interface Graph<T> {
	readonly nodes: NodeId[]
	readonly inputs: NodeId[]
	readonly outputs: NodeId[]

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
	 * @param node The node to register with the graph
	 */
	add(node: Node<T>): void

	/**
	 * Remove a node from the grpah
	 */
	remove(id: NodeId): void
}
