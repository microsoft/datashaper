/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StringReplaceArgs } from '@datashaper/schema'

import type { ColumnTableStep } from '../util/factories.js'
import { stepVerbFactory } from '../util/factories.js'
import { escape, op } from 'arquero'

export const replaceStep: ColumnTableStep<StringReplaceArgs> = (input, { column, pattern, flags, replacement, to }) => {
    const regex = new RegExp(pattern, flags)
	const fn = escape((d: any) => op.replace(d[column], regex, replacement))
	return input.derive({ [to]: fn })
}

export const replace = stepVerbFactory(replaceStep)
