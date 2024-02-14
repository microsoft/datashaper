/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SetOp } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { container } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { SocketName, StepApi, StepFunction } from '../../dataflow/index.js'
import { BaseNode, StepNode } from '../../dataflow/index.js'
import type { Maybe } from '../../primitives.js'
import { set } from './sets.js'

export type ColumnTableStep<Args> = StepFunction<ColumnTable, Args>
export type TableContainerStep<Args> = StepFunction<TableContainer, Args>
export type ColumnTableTransformer<T> = (
	input: ColumnTable,
	args: T,
) => ColumnTable

export class SetOperationNode<Args = unknown> extends BaseNode<
	TableContainer,
	Args
> {
	constructor(private op: SetOp) {
		super()
	}

	protected doRecalculate(): void {
		const source = this.inputValue()

		if (source?.table != null) {
			const others = this.getVariadicInputValues()
				.filter((t) => !!t)
				.map((o) => o?.table)
				.filter((t) => !!t) as ColumnTable[]
			this.emit(container(this.id, set(source.table, this.op, others)))
		} else {
			this.emit(undefined)
		}
	}
}

export function stepVerbFactory<Args>(
	columnTableStep: ColumnTableStep<Args>,
	inputs: SocketName[] | undefined = undefined,
	outputs: SocketName[] | undefined = undefined,
): (id: string) => StepNode<TableContainer, Args> {
	return (id: string) => {
		const step: TableContainerStep<Args> = function step(
			this: StepNode<TableContainer, Args>,
			source: TableContainer<unknown>,
			args: Args,
			api: StepApi<TableContainer>,
		) {
			// Wrap the Step API to work with ColumnTables instead of TableContainers
			const subapi: StepApi<ColumnTable> = {
				emit: (value: ColumnTable, socket?: SocketName) => {
					const tableId = socket == null ? id : `${id}.${String(socket)}`
					api.emit(container(tableId, value), socket)
				},
				input: (socket?: SocketName) => {
					const input = this.inputValue(socket)
					if (input) {
						return input.table
					}
				},
			}
			if (source.table == null) {
				return container(id)
			}
			let result: ColumnTable | undefined
			try {
				result = columnTableStep(source.table, args, subapi)
			} catch (err) {
				console.warn('error processing step', err)
				this.emitError(err)
			}
			return container(id, result as Maybe<ColumnTable>)
		}
		const result = new StepNode<TableContainer, Args>(step, inputs, outputs)
		result.id = id
		return result
	}
}

export function setOperationNodeFactory(
	op: SetOp,
): (id: string) => SetOperationNode {
	return (id: string): SetOperationNode => {
		const result = new SetOperationNode(op)
		result.id = id
		return result
	}
}
