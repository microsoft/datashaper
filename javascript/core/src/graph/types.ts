/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

/**
 * A convenience type for including undefined
 * @public
 */
export type Maybe<T> = T | undefined

/**
 * A graph processing node
 * @public
 */
export interface Node<T, Config = unknown> {
	readonly id: string
	/**
	 * The node's mutable configuration
	 */
	config: Maybe<Config>

	/**
	 * Named input sockets
	 */
	readonly inputs: string[]

	/**
	 * Named output sockets, in addition to the implicit default output socket
	 */
	readonly outputs: string[]

	/**
	 * Wires an input socket to a stream
	 * @param name - the name of the input socket
	 */
	install(name: string, binding: NodeBinding<T>): void
	/**
	 * Clear an input socket
	 * @param name - The input socket name
	 */
	uninstall(name: string): void

	/**
	 * Gets an output socket
	 * @param name - The name of the output socket. If undefined, this will use the implicit default output socket.
	 */
	output(name?: string): Observable<Maybe<T>>

	/**
	 * Gets a current output value
	 * @param name - The output name. If undefined, this will use the implicit default output socket.
	 */
	outputValue(name?: string): Maybe<T>
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
	 * The named output
	 */
	output?: string
}

export interface GraphOrchestrator<T> {
	readonly nodeIds: string[]

	/**
	 * Retrieves a node by id.
	 * @param id - the node identifier
	 * @throws - if the id is not found
	 */
	getNodeWithId(id: string): Node<T>

	// TODO: Detect Cycles?
	// TODO: events for when nodes added, removed?
	// TODO: Expose Topologically important nodes like inputs & outputs?
}
