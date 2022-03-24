/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { makeStepNode } from './nodeFactories/index.js'
import type { AggregateArgs } from './types/index.js'
import { singleExpression } from './util/index.js'

export const aggregate = makeStepNode<AggregateArgs>(
	(input, { groupby, column, operation, to }) => {
		const expr = singleExpression(column, operation)
		return input.groupby(groupby).rollup({ [to]: expr })
	},
)
