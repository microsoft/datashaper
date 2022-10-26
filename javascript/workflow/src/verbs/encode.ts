/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EncodeDecodeArgs } from '@datashaper/schema'
import { applyCodebook } from '@datashaper/tables'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const encodeStep: ColumnTableStep<EncodeDecodeArgs> = (
	input,
	{ strategy, codebook },
) => {
	return applyCodebook(input, codebook, strategy)
}
export const encode = stepVerbFactory(encodeStep)
