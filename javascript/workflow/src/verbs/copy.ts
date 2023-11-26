/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CopyArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { escape } from 'arquero'

export const copyStep: ColumnTableStep<CopyArgs> = (input, { column, to }) => {
	// eslint-disable-next-line
	const func: object = escape((d: any) => {
		return d[column]
	})

	return input.derive({ [to]: func })
}

export const copy = stepVerbFactory(copyStep)
