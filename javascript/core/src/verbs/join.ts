/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { BaseNode } from '../graph/BaseNode.js'
import { container } from '../tables/container.js'
import type { TableContainer } from '../tables/types.js'
import { NodeInput } from './types.js'

export interface JoinArgsBase {
	/**
	 * Column names to join with.
	 * If only one is specified, it will use for both tables.
	 * If none are specified, all matching column names will be used.
	 */
	on?: string[]
}

export interface JoinArgs extends JoinArgsBase {
	strategy?: JoinStrategy
}

export enum JoinStrategy {
	Inner = 'inner',
	LeftOuter = 'left outer',
	RightOuter = 'right outer',
	FullOuter = 'full outer',
}

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
	return input.join(other, on, undefined, {
		left:
			strategy === JoinStrategy.LeftOuter ||
			strategy === JoinStrategy.FullOuter,
		right:
			strategy === JoinStrategy.RightOuter ||
			strategy === JoinStrategy.FullOuter,
	})
}
