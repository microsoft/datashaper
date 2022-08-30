/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { singleExpression } from './util/index.js'

export const rollupStep: ColumnTableStep<RollupArgs> = (
	input,
	{ column, operation, to },
) => input.rollup({ [to]: singleExpression(column, operation) })

export const rollup = stepVerbFactory(rollupStep)
