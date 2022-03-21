/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { singleExpression } from '../util/index.js'

const doAggregate = wrapColumnStep<AggregateArgs>(
	(input, { groupby, column, operation, to }) => {
		const expr = singleExpression(column, operation)
		return input.groupby(groupby).rollup({ [to]: expr })
	},
)

export const aggregate = makeStepFunction(doAggregate)
export const aggregateNode = makeStepNode(doAggregate)
