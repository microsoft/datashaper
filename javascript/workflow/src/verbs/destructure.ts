/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DestructureArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const destructureStep: ColumnTableStep<DestructureArgs> = (
	input,
	{ keys, preserveSource },
) => {
	console.log(keys)
	console.log(preserveSource)
	return input
}

export const destructure = stepVerbFactory(destructureStep)
