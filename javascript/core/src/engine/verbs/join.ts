/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import { BaseNode } from '../../graph/BaseNode.js'
import type { TableStore } from '../../index.js'
import type { JoinArgs, JoinStep, TableContainer } from '../../types.js'
import { JoinStrategy } from '../../types.js'

/**
 * Executes an arquero join.
 * @param step
 * @param store
 * @returns
 */
export async function join(
	{ input, output, args }: JoinStep,
	store: TableStore,
): Promise<TableContainer> {
	const [inputTable, otherTable] = await Promise.all([
		store.get(input),
		store.get(args.other),
	])
	let result: ColumnTable | undefined
	if (inputTable.table && otherTable.table) {
		result = doJoin(inputTable.table, otherTable.table, args)
	}
	return container(output, result)
}

export enum JoinInput {
	Left = 'left',
	Right = 'right',
}
class JoinNode extends BaseNode<TableContainer, JoinArgs> {
	constructor(id: string) {
		super([JoinInput.Left, JoinInput.Right])
		this.id = id
	}

	protected doRecalculate(): void | Promise<void> {
		const left = this.inputValue(JoinInput.Left)
		const right = this.inputValue(JoinInput.Right)
		if (left?.table != null && right?.table != null && this.config != null) {
			this.emit(
				container(
					String(this.id),
					doJoin(left.table, right.table, this.config),
				),
			)
		} else {
			this.emit(undefined)
		}
	}
}

export function joinNode(id: string): JoinNode {
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
