/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CodebookSchema,DecodeArgs  } from '@datashaper/schema'
import { generateCodebook,unapplyCodebook } from '@datashaper/tables'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const decodeStep: ColumnTableStep<DecodeArgs> = (
	input,
	{ unapplyMapping },
) => {
	const codebook: CodebookSchema = generateCodebook(input)
	return unapplyCodebook(input, codebook, unapplyMapping)
}
export const decode = stepVerbFactory(decodeStep)
