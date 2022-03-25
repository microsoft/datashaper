/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ColumnTableStep } from './util/factories.js'
import type { RollupArgs } from './rollup.js'
import { singleExpression } from './util/index.js'
import { stepNodeFactory } from './util/factories.js'

export interface AggregateArgs extends RollupArgs {
	/**
	 * Column to group by
	 */
	groupby: string
}

export const aggregateStep: ColumnTableStep<AggregateArgs> = (
	input,
	{ groupby, column, operation, to },
) => {
	const expr = singleExpression(column, operation)
	return input.groupby(groupby).rollup({ [to]: expr })
}
export const aggregate = stepNodeFactory(aggregateStep)
