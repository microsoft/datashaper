/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import type { AggregateArgs, TableContainer } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'
import { singleExpression } from '../util/index.js'

export const aggregate = makeStepFunction(doAggregate)
export const aggregateNode = makeStepNode(doAggregate)

function doAggregate(
	id: string,
	input: TableContainer,
	{ groupby, column, operation, to }: AggregateArgs,
) {
	let result: ColumnTable | undefined
	if (input.table) {
		const expr = singleExpression(column, operation)
		result = input.table.groupby(groupby).rollup({ [to]: expr })
	}
	return container(id, result)
}
