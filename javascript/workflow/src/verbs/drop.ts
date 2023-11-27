/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DropArgs } from '@datashaper/schema'
import { not } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const dropStep: ColumnTableStep<DropArgs> = (
	input,
	{ columns = [] },
) => {
	return input.select(not(columns))
}

export const drop = stepVerbFactory(dropStep)
