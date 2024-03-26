/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CopyArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const copyStep: ColumnTableStep<CopyArgs> = (input, { column, to }) => {
	return input
		.params({
			column,
		})
		.derive({ [to]: (d: any, $: any) => d[$.column] })
}

export const copy = stepVerbFactory(copyStep)
