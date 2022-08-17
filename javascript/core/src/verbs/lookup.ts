/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import { container } from '@datashaper/arquero'
import { BaseNode, NodeInput } from '@datashaper/dataflow'
import type { LookupArgs } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

class LookupNode extends BaseNode<TableContainer, LookupArgs> {
	constructor(id: string) {
		super([NodeInput.Other])
		this.id = id
	}

	protected doRecalculate(): void | Promise<void> {
		const input = this.inputValue()
		const other = this.inputValue(NodeInput.Other)
		if (input?.table != null && other?.table != null && this.config != null) {
			this.emit(
				container(this.id, doLookup(input.table, other.table, this.config)),
			)
		} else {
			this.emit(undefined)
		}
	}
}

export function lookup(id: string): LookupNode {
	return new LookupNode(id)
}

function doLookup(
	input: ColumnTable,
	other: ColumnTable,
	{ on = [], columns }: LookupArgs,
): ColumnTable {
	// arquero typings are messed up for the lookup join keys
	return input.lookup(other, on as any, ...columns)
}
