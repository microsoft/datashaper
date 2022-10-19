/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BaseNode } from './BaseNode.js'

export type StepFunction<T, Args> = (source: T, args: Args) => T

export class StepNode<T, Args> extends BaseNode<T, Args> {
	private _step: StepFunction<T, Args>

	constructor(step: StepFunction<T, Args>) {
		super()
		this._step = step.bind(this)
	}
	protected doRecalculate(): void {
		const source = this.inputValue()
		if (source != null && this.config != null) {
			const output = this._step(source, this.config)
			this.emit(output)
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
