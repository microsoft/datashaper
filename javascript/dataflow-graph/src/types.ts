/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type Unsubscribe = () => void
export type Handler<T> = (arg: T) => void

export interface StateChangePayload<T> {
	state: T
}
export interface DataChangePayload<T> {
	data: T
}

export interface ErrorState {
	message: string
	error?: Error
}

/**
 * The states a processing node can be in.
 */
export enum NodeState {
	/**
	 * The node has been created, but has not been configured for processing.
	 */
	Unconfigured = 'unconfigured',

	/**
	 * The node has been configured and is ready for processing, but does not yet have data.
	 */
	Ready = 'ready',

	/**
	 * The node has data
	 */
	Hydrated = 'hydrated',

	/**
	 * The node is in an error state
	 */
	Error = 'error',
}

export interface Node<Data = unknown, Config = unknown> {
	/**
	 * The node's mutable configuration
	 */
	config: Config | undefined

	readonly error: ErrorState | undefined
	readonly data: Data | undefined
	readonly state: NodeState

	/**
	 * Sockets represent named processing node inputs
	 */
	readonly socketNames: string[]

	/**
	 *
	 * @param name The socket name to use
	 * @param node The upstream processing node to wire in
	 * @throws if the socket name is unknown
	 */
	install(name: string, node: Node<Data>): void

	/**
	 * Clears a socket by name
	 * @param name The socket name to clear
	 */
	uninstall(name: string): void

	/**
	 * Subscribe to events for when the state changes
	 * @param handler the event handler
	 */
	onStateChange(handler: Handler<StateChangePayload<NodeState>>): Unsubscribe

	/**
	 * Subscribe to events for when the data changes
	 * @param handler the event handler
	 */
	onDataChange(
		handler: Handler<DataChangePayload<Data | undefined>>,
	): Unsubscribe

	/**
	 * Subscribe to events for when the error-state changes
	 */
	onErrorChange(handler: Handler<ErrorState | undefined>): Unsubscribe
}
