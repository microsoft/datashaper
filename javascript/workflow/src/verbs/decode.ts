/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DecodeArgs } from '@datashaper/schema'
import { unapplyCodebook } from '@datashaper/tables'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const decodeStep: ColumnTableStep<DecodeArgs> = (
	input,
	{ unapplyMapping },
) => {
	return unapplyCodebook(input, null, unapplyMapping)
}
export const decode = stepVerbFactory(decodeStep)
