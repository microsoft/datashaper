/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StringsArgs } from '@datashaper/schema'

import type { ColumnTableStep } from '../util/factories.js'
import { stepVerbFactory } from '../util/factories.js'
import { escape, op } from 'arquero'

export const lowerStep: ColumnTableStep<StringsArgs> = (
	input,
	{ column, to },
) => {
	const fn = escape((d: any) => op.lower(d[column]))
	return input.derive({ [to]: fn })
}

export const lower = stepVerbFactory(lowerStep)
