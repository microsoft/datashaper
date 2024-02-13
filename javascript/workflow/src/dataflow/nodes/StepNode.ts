/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SocketName } from '../types.js'
import { BaseNode } from './BaseNode.js'

/**
 * The API available to step functions.
 */
export interface StepApi<T> {
	/**
	 * Gets data from an input socket. If undefined, default input
	 * @param socket - The socket name to get data for
	 */
	input(socket?: SocketName): T | undefined

	/** 
	 * Emits data to an output socket. If undefined, default output.
	 * 
	 * @param value - The value to emit
	 * @param socket - The socket name to emit data to
	 */
	emit(value: T, socket?: SocketName): void
}

export type StepFunction<T, Args> = (source: T, args: Args, api: StepApi<T>) => T

export class StepNode<T, Args> extends BaseNode<T, Args> {
	private _step: StepFunction<T, Args>
	private _stepApi: StepApi<T> = {
		input: (name?: SocketName) => this.inputValue(name),
		emit: (value: T, name?: SocketName) => this.emit(value, name),
	}

	constructor(step: StepFunction<T, Args>, inputs?: SocketName[], outputs?: SocketName[]) {
		super(inputs, outputs)
		this._step = step.bind(this)
	}

	protected get stepApi(): StepApi<T> {
		return this._stepApi as StepApi<T>
	}

	protected doRecalculate(): void {
		const source = this.inputValue()
		if (source != null && this.config != null) {
			const output = this._step(source, this.config, this.stepApi)
			this.emit(output)
		} else {
			// emit undefined values to all outputs
			this.emit(undefined)
			for (const output of this.outputs) {
				this.emit(undefined, output)
			}
		}
	}
}

export function stepNodeFactory<T, Args>(
	stepFunction: StepFunction<T, Args>,
): (id: string) => StepNode<T, Args> {
	return (id: string) => {
		const result = new StepNode(stepFunction)
		result.id = id
		return result
	}
}
