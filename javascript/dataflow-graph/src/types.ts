/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

export type Maybe<T> = T | undefined

export interface Node<T, Config = unknown> {
	/**
	 * The node's mutable configuration
	 */
	config: Maybe<Config>

	/**
	 * Sockets represent named processing node inputs
	 */
	readonly inputs: string[]
	/**
	 * Named output sockets
	 */
	readonly outputs: string[]

	/**
	 * Gets an input socket
	 * @param name the name of the input socket
	 */
	install(name: string, socket: Observable<Maybe<T>>): void

	/**
	 * Clear an input socket
	 * @param name
	 */
	uninstall(name: string): void

	/**
	 * Gets an output socket
	 * @param name The name of the output socket
	 */
	output(name: string): Observable<Maybe<T>>

	/**
	 * Gets the current output value
	 * @param name The output name
	 */
	outputValue(name: string): Maybe<T>
}
