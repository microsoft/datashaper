/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import type { InputColumnArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export interface OnehotArgs extends InputColumnArgs {
	/**
	 * Optional prefix for the output column names
	 */
	prefix?: string
}

/**
 * Executes a  one-hot encoding. This creates a new column for each unique value in the specified column.
 * An optional prefix can be specified for the output columns, to help differentiate source columns on large tables.
 */
export const onehotStep: ColumnTableStep<OnehotArgs> = (
	input,
	{ column, prefix },
) => {
	// note that this ignores potential grouping
	// TODO: should this only apply to string column types?
	const distinct = input
		.rollup({
			distinct: op.array_agg_distinct(column),
		})
		.get('distinct', 0) as any[]

	const args = distinct.reduce((acc, cur) => {
		acc[prefix ? `${prefix}${cur}` : cur] = escape((d: any) =>
			d[column] === null ? null : d[column] === cur ? 1 : 0,
		)
		return acc
	}, {} as Record<string, ExprObject>)

	return input.derive(args)
}

export const onehot = stepVerbFactory(onehotStep)
