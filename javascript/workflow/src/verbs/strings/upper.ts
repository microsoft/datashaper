/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StringsArgs } from '@datashaper/schema'

import { op } from 'arquero'
import type { ColumnTableStep } from '../util/factories.js'
import { stepVerbFactory } from '../util/factories.js'

export const upperStep: ColumnTableStep<StringsArgs> = (
	input,
	{ column, to },
) => {
	return input
		.params({ column })
		.derive({ [to]: (d: any, $: any) => op.upper(d[$.column]) })
}

export const upper = stepVerbFactory(upperStep)
