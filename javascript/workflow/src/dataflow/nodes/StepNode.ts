/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'
import { BaseNode } from './BaseNode.js'

const log = debug('datashaper:StepNode')

export type StepFunction<T, Args> = (source: T, args: Args) => T

export class StepNode<T, Args> extends BaseNode<T, Args> {
	private _step: StepFunction<T, Args>
	private _lastOutput: T | undefined

	constructor(step: StepFunction<T, Args>) {
		super()
		this._step = step.bind(this)
	}
	protected doRecalculate(): void {
		const source = this.inputValue()
		if (source != null && this.config != null) {
			const output = this._step(source, this.config)
			if (this._lastOutput !== output) {
				this._lastOutput = output
				log(`${this.id} emitting output`)
				this.emit(output)
			}
		} else if (this._lastOutput != null) {
			log(`${this.id} emitting undefined`)
			this._lastOutput = undefined
			this.emit(undefined)
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
