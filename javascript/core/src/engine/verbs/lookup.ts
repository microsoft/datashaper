/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import { BaseNode } from '../../graph/BaseNode.js'
import type { TableStore } from '../../index.js'
import type { LookupArgs, LookupStep, TableContainer } from '../../types.js'

/**
 * Executes an arquero lookup.
 * @param step
 * @param store
 * @returns
 */
export async function lookup(
	{ input, output, args }: LookupStep,
	store: TableStore,
): Promise<TableContainer> {
	const [inputTable, otherTable] = await Promise.all([
		store.get(input),
		store.get(args.other),
	])
	let result: ColumnTable | undefined
	if (inputTable.table && otherTable.table) {
		result = doLookup(inputTable.table, otherTable.table, args)
	}
	return container(output, result)
}

export enum LookupInput {
	Input = 'Input',
	Other = 'Other',
}
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
				container(
					String(this.id),
					doLookup(input.table, other.table, this.config),
				),
			)
		} else {
			this.emit(undefined)
		}
	}
}

export function lookupNode(id: string): LookupNode {
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
