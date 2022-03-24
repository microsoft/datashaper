/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { NodeId } from '../../graph/index.js'
import { BaseNode } from '../../graph/index.js'
import { container } from '../../tables/container.js'
import type { TableContainer } from '../../tables/types.js'
import type { StepComputeFn, TableStep } from './types.js'
import { NodeInput } from './types.js'

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

export function makeStepNode<Args>(
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
