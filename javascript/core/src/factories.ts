/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@data-wrangling-components/dataflow-graph'
import { NodeImpl } from '@data-wrangling-components/dataflow-graph'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { DefaultPipeline } from './DefaultPipeline.js'
import { DefaultTableStore } from './DefaultTableStore.js'
import type { Pipeline, Step,TableContainer, TableStore } from './types.js'

export function createTableStore(tables?: TableContainer[]): TableStore {
	return new DefaultTableStore(tables)
}

export function createPipeline(store: TableStore): Pipeline {
	return new DefaultPipeline(store)
}

export function container(
	id: string,
	table?: ColumnTable,
	options: Omit<TableContainer, 'id' | 'table'> = {},
): TableContainer {
	return {
		id,
		table,
		name: options.name || id,
	}
}

export type StepComputeFn<Args> = (
	table: ColumnTable,
	args: Args,
) => Promise<Maybe<ColumnTable>> | Maybe<ColumnTable>

export enum StepNodeInput {
	Source = 'source',
}

export class StepNode<Args> extends NodeImpl<ColumnTable, Args> {
	constructor(private _computeFn: StepComputeFn<Args>) {
		super([StepNodeInput.Source])
	}
	protected async doRecalculate(): Promise<void> {
		const source = this.inputValue(StepNodeInput.Source)
		if (source != null && source != null && this.config != null) {
			const output = await this._computeFn(source, this.config)
			this.emit(output)
		} else {
			this.emit(undefined)
		}
	}
}

export function makeStepNode<Args>(
	compute: StepComputeFn<Args>,
): () => StepNode<Args> {
	return () => new StepNode(compute)
}

export function makeStepFunction<Args>(compute: StepComputeFn<Args>) {
	return async ({ input, output, args }: Step<Args>, store: TableStore) => {
		const inputTable = await store.table(input)
		const result = await compute(inputTable, args)
		return container(output, result)
	}
}
