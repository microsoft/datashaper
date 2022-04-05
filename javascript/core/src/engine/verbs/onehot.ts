/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import type { OneHotArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

/**
 * Executes a  one-hot encoding. This creates a new column for each unique value in the specified column.
 * An optional prefix can be specified for the output columns, to help differentiate source columns on large tables.
 */
const doOneHot = wrapColumnStep<OneHotArgs>((input, { column, prefix }) => {
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
})

export const onehot = makeStepFunction(doOneHot)
export const oneHotNode = makeStepNode(doOneHot)
