/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { BaseNode } from '../graph/BaseNode.js'
import { container } from '../tables/container.js'
import type { TableContainer } from '../tables/types.js'
import type { LookupArgs } from './types/index.js'
import { LookupInput } from './types/index.js'

class LookupNode extends BaseNode<TableContainer, LookupArgs> {
	constructor(id: string) {
		super([LookupInput.Input, LookupInput.Other])
		this.id = id
	}

	protected doRecalculate(): void | Promise<void> {
		const input = this.inputValue(LookupInput.Input)
		const other = this.inputValue(LookupInput.Other)
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
