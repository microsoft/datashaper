/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { NodeId } from '../../graph/index.js'
import { BaseNode, VariadicNodeImpl } from '../../graph/index.js'
import { container } from '../../tables/container.js'
import type { TableContainer } from '../../tables/types.js'
import type { SetOp } from '../../types.js'
import { set } from './sets.js'

export type StepComputeFn<Args> = (
	id: string,
	source: TableContainer,
	args: Args,
) => Promise<TableContainer> | TableContainer

export type InputComputeFn<Args> = (args: Args) => Promise<ColumnTable>
export type ColumnTableTransformer<T> = (
	input: ColumnTable,
	args: T,
) => ColumnTable

export enum NodeInput {
	Source = 'source',
}

export class StepNode<Args> extends BaseNode<TableContainer, Args> {
	constructor(id: NodeId, private _computeFn: StepComputeFn<Args>) {
		super([NodeInput.Source])
		this.id = id
	}
	protected async doRecalculate(): Promise<void> {
		const source = this.inputValue(NodeInput.Source)
		if (source != null && this.config != null) {
			const output = await this._computeFn(this.id, source, this.config)
			this.emit(output)
		} else {
			this.emit(undefined)
		}
	}
}

export class InputNode<Args> extends BaseNode<TableContainer, Args> {
	constructor(id: NodeId, private _computeFn: InputComputeFn<Args>) {
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

export class SetOperationNode<Args = unknown> extends VariadicNodeImpl<
	TableContainer,
	Args
> {
	constructor(id: NodeId, private op: SetOp) {
		super([NodeInput.Source])
		this.id = id
	}

	protected doRecalculate(): void {
		const source = this.inputValue(NodeInput.Source)
		if (source != null && source.table != null) {
			const others = this.getVariadicInputValues()
				.filter(t => !!t)
				.map(o => o?.table)
				.filter(t => !!t) as ColumnTable[]
			this.emit(container(this.id, set(source.table, this.op, others)))
		} else {
			this.emit(undefined)
		}
	}
}

export function makeStepNode<Args>(
	inner: (input: ColumnTable, args: Args) => ColumnTable,
): (id: string) => StepNode<Args> {
	return (id: string) =>
		new StepNode(
			id,
			(id: string, source: TableContainer<unknown>, args: Args) => {
				let result: ColumnTable | undefined
				if (source.table) {
					result = inner(source.table, args)
				}
				return container(id, result)
			},
		)
}

export function makeInputNode<Args>(
	compute: InputComputeFn<Args>,
): (id: string) => InputNode<Args> {
	return (id: string) => new InputNode(id, compute)
}
