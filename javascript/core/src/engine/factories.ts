/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@data-wrangling-components/dataflow-graph'
import { NodeImpl } from '@data-wrangling-components/dataflow-graph'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../container.js'
import type { Step, TableStore } from '../types.js'

export type StepComputeFn<Args> = (
	table: ColumnTable,
	args: Args,
) => Promise<Maybe<ColumnTable>> | Maybe<ColumnTable>

export type InputComputeFn<Args> = (
	args: Args,
) => Promise<Maybe<ColumnTable>> | Maybe<ColumnTable>

export enum StepNodeInput {
	Source = 'source',
}

export class StepNode<Args> extends NodeImpl<ColumnTable, Args> {
	constructor(private _computeFn: StepComputeFn<Args>) {
		super([StepNodeInput.Source])
	}
	protected async doRecalculate(): Promise<void> {
		const source = this.inputValue(StepNodeInput.Source)
		if (source != null && source != null && this.config != null) {
			const output = await this._computeFn(source, this.config)
			this.emit(output)
		} else {
			this.emit(undefined)
		}
	}
}

export class InputNode<Args> extends NodeImpl<ColumnTable, Args> {
	constructor(private _computeFn: InputComputeFn<Args>) {
		super()
	}
	protected async doRecalculate(): Promise<void> {
		if (this.config != null) {
			const output = await this._computeFn(this.config)
			this.emit(output)
		} else {
			this.emit(undefined)
		}
	}
}

export function makeStepNode<Args>(
	compute: StepComputeFn<Args>,
): () => StepNode<Args> {
	return function stepNodeFactory() {
		return new StepNode(compute)
	}
}

export function makeInputNode<Args>(
	compute: InputComputeFn<Args>,
): () => InputNode<Args> {
	return function inputNodeFactory() {
		return new InputNode(compute)
	}
}

export function makeStepFunction<Args>(compute: StepComputeFn<Args>) {
	return async function stepFn(
		{ input, output, args }: Step<Args>,
		store: TableStore,
	) {
		const inputTable = await store.table(input)
		const result = await compute(inputTable, args)
		return container(output, result)
	}
}

export function makeInputFunction<Args>(compute: InputComputeFn<Args>) {
	return async function inputFn({ output, args }: Step<Args>) {
		const result = await compute(args)
		return container(output, result)
	}
}
