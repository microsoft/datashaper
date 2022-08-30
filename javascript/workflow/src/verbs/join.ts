/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@datashaper/schema'
import { JoinStrategy } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { container } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { BaseNode, NodeInput } from '../dataflow/index.js'

class JoinNode extends BaseNode<TableContainer, JoinArgs> {
	constructor(id: string) {
		super([NodeInput.Other])
		this.id = id
	}

	protected doRecalculate(): void | Promise<void> {
		const left = this.inputValue()
		const right = this.inputValue(NodeInput.Other)
		if (left?.table != null && right?.table != null && this.config != null) {
			this.emit(
				container(this.id, doJoin(left.table, right.table, this.config)),
			)
		} else {
			this.emit(undefined)
		}
	}
}

export function join(id: string): JoinNode {
	return new JoinNode(id)
}

function doJoin(
	input: ColumnTable,
	other: ColumnTable,
	{ on, strategy = JoinStrategy.Inner }: JoinArgs,
): ColumnTable {
	switch (strategy) {
		case JoinStrategy.SemiJoin:
			return input.semijoin(other, on)
		case JoinStrategy.AntiJoin:
			return input.antijoin(other, on)
		case JoinStrategy.Cross:
			return input.cross(other)
		default:
			return input.join(other, on, undefined, {
				left:
					strategy === JoinStrategy.LeftOuter ||
					strategy === JoinStrategy.FullOuter,
				right:
					strategy === JoinStrategy.RightOuter ||
					strategy === JoinStrategy.FullOuter,
			})
	}
}
