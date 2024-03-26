/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StringsReplaceArgs } from '@datashaper/schema'

import type { ColumnTableStep } from '../util/factories.js'
import { stepVerbFactory } from '../util/factories.js'
import { op } from 'arquero'

export const replaceStep: ColumnTableStep<StringsReplaceArgs> = (
	input,
	{ column, pattern, replacement, globalSearch, caseInsensitive, to },
) => {
	const flags = `${globalSearch ? 'g' : ''}${caseInsensitive ? 'i' : ''}`
	const regex = new RegExp(pattern, flags)
	return input
		.params({
			column,
			regex,
			replacement,
		})
		.derive({
			[to]: (d: any, $: any) => op.replace(d[$.column], $.regex, $.replacement),
		})
}

export const replace = stepVerbFactory(replaceStep)
