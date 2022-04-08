/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { handleMaybeAsync } from '../primitives.js'
import { BaseNode } from './BaseNode.js'

export type StepFunction<T, Args> = (source: T, args: Args) => Promise<T> | T

export class StepNode<T, Args> extends BaseNode<T, Args> {
	constructor(private _step: StepFunction<T, Args>) {
		super()
	}
	protected doRecalculate(): Promise<void> | void {
		const source = this.inputValue()
		if (source != null && this.config != null) {
			const output = this._step(source, this.config)
			return handleMaybeAsync(output, v => this.emit(v))
		} else {
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
