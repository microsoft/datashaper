/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { NodeId } from '../../graph/index.js'
import { BaseNode } from '../../graph/index.js'
import { container } from '../../tables/container.js'
import type { TableContainer } from '../../tables/types.js'
import { NodeInput } from '../types.js'
import { handleMaybeAsync } from '../util/handleMaybeAsync.js'
import type { StepComputeFn, TableStep } from './types.js'

export class StepNode<Args> extends BaseNode<TableContainer, Args> {
	constructor(id: NodeId, private _computeFn: StepComputeFn<Args>) {
		super([NodeInput.Input])
		this.id = id
	}
	protected doRecalculate(): Promise<void> | void {
		const source = this.inputValue(NodeInput.Input)
		if (source != null && this.config != null) {
			const output = this._computeFn(this.id, source, this.config)
			return handleMaybeAsync(output, v => this.emit(v))
		} else {
			this.emit(undefined)
		}
	}
}

export function stepNodeFactory<Args>(
	inner: TableStep<Args>,
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
