/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EncodeDecodeArgs } from '@datashaper/schema'
import { unapplyCodebook } from '@datashaper/tables'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const decodeStep: ColumnTableStep<EncodeDecodeArgs> = (
	input,
	{ strategy, codebook },
) => {
	return unapplyCodebook(input, codebook, strategy)
}
export const decode = stepVerbFactory(decodeStep)
