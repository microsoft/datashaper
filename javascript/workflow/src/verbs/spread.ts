/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const spreadStep: ColumnTableStep<SpreadArgs> = (
	input,
	{ to, column, preserveSource = false },
) => {
	return input.spread(column, { as: to, drop: !preserveSource })
}

export const spread = stepVerbFactory(spreadStep)
