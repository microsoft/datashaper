/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeImpl } from '@data-wrangling-components/dataflow-graph'

import type {
	Step,
	StepFunction,
	TableContainer,
	TableStore,
} from '../types.js'

export type StepComputeFn<Args> = (
	id: string,
	source: TableContainer,
	args: Args,
) => Promise<TableContainer> | TableContainer

export type InputComputeFn<Args> = (
	id: string,
	args: Args,
) => Promise<TableContainer> | TableContainer

export enum StepNodeInput {
	Source = 'source',
}

export class StepNode<Args> extends NodeImpl<TableContainer, Args> {
	constructor(
		public readonly id: string,
		private _computeFn: StepComputeFn<Args>,
	) {
		super([StepNodeInput.Source])
	}
	protected async doRecalculate(): Promise<void> {
		const source = this.inputValue(StepNodeInput.Source)
		if (source != null && source != null && this.config != null) {
			const output = await this._computeFn(this.id, source, this.config)
			this.emit(output)
		} else {
			this.emit(undefined)
		}
	}
}

export class InputNode<Args> extends NodeImpl<TableContainer, Args> {
	constructor(
		public readonly id: string,
		private _computeFn: InputComputeFn<Args>,
	) {
		super()
	}
	protected async doRecalculate(): Promise<void> {
		if (this.config != null) {
			const output = await this._computeFn(this.id, this.config)
			this.emit(output)
		} else {
			this.emit(undefined)
		}
	}
}

export function makeStepNode<Args>(
	compute: StepComputeFn<Args>,
): (id: string) => StepNode<Args> {
	return (id: string) => new StepNode(id, compute)
}

export function makeInputNode<Args>(
	compute: InputComputeFn<Args>,
): (id: string) => InputNode<Args> {
	return (id: string) => new InputNode(id, compute)
}

export function makeStepFunction<Args>(
	compute: StepComputeFn<Args>,
): StepFunction<Args> {
	return async function stepFn(
		{ input, output, args }: Step<Args>,
		store: TableStore,
	) {
		const inputTable = await store.get(input)
		return await compute(output, inputTable, args)
	}
}

export function makeInputFunction<Args>(compute: InputComputeFn<Args>) {
	return function inputFn({ output, args }: Step<Args>) {
		return compute(output, args)
	}
}
