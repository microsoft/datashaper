/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadJsonArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const spreadJsonStep: ColumnTableStep<SpreadJsonArgs> = (
	input,
	{ jsonObject },
) => {
	console.log(jsonObject)
	return input
}

export const spreadJson = stepVerbFactory(spreadJsonStep)
