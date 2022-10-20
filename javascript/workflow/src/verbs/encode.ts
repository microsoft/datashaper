/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EncodeArgs } from '@datashaper/schema'
import { applyCodebook } from '@datashaper/tables'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const encodeStep: ColumnTableStep<EncodeArgs> = (
	input,
	{ applyMapping, codebook },
) => {
	return applyCodebook(input, codebook, applyMapping)
}
export const encode = stepVerbFactory(encodeStep)
