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
	install(name: string, socket: Observable<Maybe<T>>): void

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
