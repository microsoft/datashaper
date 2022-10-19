/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CodebookSchema,EncodeArgs  } from '@datashaper/schema'
import { applyCodebook, generateCodebook } from '@datashaper/tables'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const encodeStep: ColumnTableStep<EncodeArgs> = (
	input,
	{ applyMapping },
) => {
	const codebook: CodebookSchema = generateCodebook(input)
	return applyCodebook(input, codebook, applyMapping)
}
export const encode = stepVerbFactory(encodeStep)
