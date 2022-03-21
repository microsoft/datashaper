/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../container.js'
import { NodeImpl } from '../graph/index.js'
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

export type InputComputeFn<Args> = (args: Args) => Promise<ColumnTable>

export enum StepNodeInput {
	Source = 'source',
}

export class StepNode<Args> extends NodeImpl<TableContainer, Args> {
	constructor(id: string, private _computeFn: StepComputeFn<Args>) {
		super([StepNodeInput.Source])
		this.id = id
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
	constructor(id: string, private _computeFn: InputComputeFn<Args>) {
		super()
		this.id = id
	}
	protected async doRecalculate(): Promise<void> {
		if (this.config != null) {
			const output = await this._computeFn(this.config)
			this.emit(container(this.id, output))
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

export function makeInputFunction<Args>(
	compute: InputComputeFn<Args>,
): StepFunction<Args> {
	return async function inputFn({ output, args }: Step<Args>) {
		const table = await compute(args)
		return container(output, table)
	}
}

export function wrapColumnStep<Args>(
	inner: (input: ColumnTable, args: Args) => ColumnTable,
): StepComputeFn<Args> {
	return (id: string, source: TableContainer<unknown>, args: Args) => {
		let result: ColumnTable | undefined
		if (source.table) {
			result = inner(source.table, args)
		}
		return container(id, result)
	}
}
