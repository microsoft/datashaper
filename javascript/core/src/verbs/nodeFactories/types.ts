/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { TableContainer } from '../../tables/types.js'

export type TableStep<Args> = (input: ColumnTable, args: Args) => ColumnTable

export type StepComputeFn<Args> = (
	id: string,
	source: TableContainer,
	args: Args,
) => Promise<TableContainer> | TableContainer

export type InputStep<Args> = (args: Args) => Promise<ColumnTable> | ColumnTable
export type ColumnTableTransformer<T> = (
	input: ColumnTable,
	args: T,
) => ColumnTable

export enum NodeInput {
	Source = 'source',
}
