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

export type SocketStateChangePayload = StateChangePayload<SocketState>

export interface ErrorState {
	message: string
	error?: Error
}

/**
 * The states a socketetable can be in.
 */
export enum SocketState {
	/**
	 * The socket has been created, but has not been configured for processing.
	 */
	Unconfigured = 'unconfigured',

	/**
	 * The socket has been configured and is ready for processing, but does not yet have data.
	 */
	Ready = 'ready',

	/**
	 * The socket has data
	 */
	Hydrated = 'hydrated',

	/**
	 * The socket is in an error state
	 */
	Error = 'error',
}

export interface Node<Data = unknown> {
	readonly error: ErrorState | undefined
	readonly data: Data | undefined
	readonly state: SocketState

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
	installSocket(name: string, node: Node<Data>): void

	/**
	 * Clears a socket by name
	 * @param name The socket name to clear
	 */
	clearSocket(name: string): void

	/**
	 * Subscribe to events for when the state changes
	 * @param handler the event handler
	 */
	onStateChange(handler: Handler<SocketStateChangePayload>): Unsubscribe

	/**
	 * Subscribe to events for when the data changes
	 * @param handler the event handler
	 */
	onDataChange(handler: Handler<DataChangePayload<Data>>): Unsubscribe

	/**
	 * Subscribe to events for when the error-state changes
	 */
	onErrorChange(handler: Handler<ErrorState | undefined>): Unsubscribe
}
