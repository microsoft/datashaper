/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { NodeId } from '../../graph/index.js'
import { VariadicNodeImpl } from '../../graph/index.js'
import { container } from '../../tables/container.js'
import type { TableContainer } from '../../tables/types.js'
import { NodeInput } from '../types/enums.js'
import type { SetOp } from '../types/index.js'
import { set } from '../util/sets.js'

export class SetOperationNode<Args = unknown> extends VariadicNodeImpl<
	TableContainer,
	Args
> {
	constructor(id: NodeId, private op: SetOp) {
		super([NodeInput.Input])
		this.id = id
	}

	protected doRecalculate(): void {
		const source = this.inputValue(NodeInput.Input)

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
