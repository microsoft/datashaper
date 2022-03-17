/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	DataChangePayload,
	ErrorState,
	Handler,	Node,
	StateChangePayload,
	Unsubscribe} from './types';
import {
	NodeState
} from './types'

export abstract class NodeImpl<Data, Config> implements Node<Data, Config> {
	private _config: Config | undefined

	// internal processing state
	private _error: ErrorState | undefined
	private _data: Data | undefined
	private _state = NodeState.Unconfigured

	// upstream socket wiring
	private _sockets: Map<string, Node<Data> | undefined> = new Map()
	private _subscriptions: Map<string, Unsubscribe> = new Map()

	// downstream event subscriberrs
	private _stateHandlers: Handler<StateChangePayload<NodeState>>[] = []
	private _dataHandlers: Handler<DataChangePayload<Data | undefined>>[] = []
	private _errorHandlers: Handler<ErrorState | undefined>[] = []

	public constructor(private _socketNames: string[]) {}

	public get error(): ErrorState | undefined {
		return this._error
	}

	protected set error(error: ErrorState | undefined) {
		if (error !== this.error) {
			this._error = error
			this._errorHandlers.forEach(s => s(error))
		}
	}

	public get data(): Data | undefined {
		return this._data
	}

	protected set data(data: Data | undefined) {
		if (data !== this.data) {
			this._data = data
			const payload = { data }
			this._dataHandlers.forEach(s => s(payload))
		}
	}

	public get state(): NodeState {
		return this._state
	}

	protected set state(state: NodeState) {
		if (state !== this.state) {
			this._state = state
			const payload = { state }
			this._stateHandlers.forEach(s => s(payload))
		}
	}

	public get socketNames(): string[] {
		return this._socketNames
	}

	public get config(): Config | undefined {
		return this._config
	}

	public set config(value: Config | undefined) {
		this._config = value
		this.recalculate()
	}

	public clearSocket(name: string): void {
		if (this._sockets.has(name)) {
			// unsubscribe from updates
			const unsubscribe = this._subscriptions.get(name)
			unsubscribe && unsubscribe()

			// remove the node
			this._sockets.delete(name)
			this._subscriptions.delete(name)

			this.recalculate()
		} else {
			throw new Error(`unknown socket name ${name}`)
		}
	}

	public installSocket(name: string, node: Node<Data>) {
		if (this.socketNames.indexOf(name) === -1) {
			throw new Error(`unknown socket name ${name}`)
		}
		const unsubscribe = node.onDataChange(() => this.recalculate())
		this._subscriptions.set(name, unsubscribe)
		this._sockets.set(name, node)
		this.recalculate()
	}

	public configure(config: Config) {
		this._config = config
		this.recalculate()
	}

	/**
	 * Subscribe to events for when the state changes
	 * @param handler the event handler
	 */
	public onStateChange(
		handler: Handler<StateChangePayload<NodeState>>,
	): Unsubscribe {
		this._stateHandlers.push(handler)
		return () =>
			(this._stateHandlers = this._stateHandlers.filter(h => h !== handler))
	}

	/**
	 * Subscribe to events for when the data changes
	 * @param handler the event handler
	 */
	public onDataChange(
		handler: Handler<DataChangePayload<Data | undefined>>,
	): Unsubscribe {
		this._dataHandlers.push(handler)
		return () =>
			(this._dataHandlers = this._dataHandlers.filter(h => h !== handler))
	}

	/**
	 * Subscribe to events for when the error-state changes
	 */
	public onErrorChange(handler: Handler<ErrorState | undefined>): Unsubscribe {
		this._errorHandlers.push(handler)
		return () =>
			(this._errorHandlers = this._errorHandlers.filter(h => h !== handler))
	}

	/**
	 * Calculate the value of this processing node. This may be invoked even if this
	 * processing node is not fully configured. recalulate() should account for this
	 */
	private recalculate(): void {
		// verify all named sockets are installed
		for (const socketName of this.socketNames) {
			if (!this._sockets.has(socketName)) {
				this.state = NodeState.Unconfigured
				this.data = undefined
				this.error = undefined
				return
			}
		}

		try {
			this.performRecalculation()
		} catch (error: unknown) {
			this.error = {
				message: 'error calculating new state',
				error: error as Error,
			}
		}
	}

	protected abstract performRecalculation(): void
}
