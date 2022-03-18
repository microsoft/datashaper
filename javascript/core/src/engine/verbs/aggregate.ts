/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { AggregateArgs } from '../../types.js'
import { singleExpression } from '../util/index.js'

export const aggregate = makeStepFunction(doAggregate)
export const aggregateNode = makeStepNode(doAggregate)

function doAggregate(input: ColumnTable, config: AggregateArgs) {
	const { groupby, column, operation, to } = config
	const expr = singleExpression(column, operation)
	const rArgs = { [to]: expr }
	return input.groupby(groupby).rollup(rArgs)
}
