/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import { container } from '@datashaper/arquero'
import type { StepFunction } from '@essex/dataflow'
import { BaseVariadicNode, StepNode } from '@essex/dataflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { Maybe } from '../../primitives.js'
import type { SetOp } from '../types.js'
import { set } from './sets.js'

export type ColumnTableStep<Args> = StepFunction<ColumnTable, Args>
export type TableContainerStep<Args> = StepFunction<TableContainer, Args>
export type ColumnTableTransformer<T> = (
	input: ColumnTable,
	args: T,
) => ColumnTable

export class SetOperationNode<Args = unknown> extends BaseVariadicNode<
	TableContainer,
	Args
> {
	constructor(private op: SetOp) {
		super()
	}

	protected doRecalculate(): void {
		const source = this.inputValue()

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

export function stepVerbFactory<Args>(
	columnTableStep: ColumnTableStep<Args>,
): (id: string) => StepNode<TableContainer, Args> {
	return (id: string) => {
		const step: TableContainerStep<Args> = (
			source: TableContainer<unknown>,
			args: Args,
		) => {
			if (source.table) {
				let result: ColumnTable | Promise<ColumnTable> | undefined
				try {
					result = columnTableStep(source.table, args)
				} catch (err) {
					console.warn('error processing step', err)
				}

				// handle promise-based result
				if ((result as any)?.then) {
					return (result as Promise<Maybe<ColumnTable>>).then(t =>
						container(id, t),
					)
				} else {
					// handle synchronous result
					return container(id, result as Maybe<ColumnTable>)
				}
			} else {
				// handle source.table ==null
				return container(id)
			}
		}
		const result = new StepNode<TableContainer, Args>(step)
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
