/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FillArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const fillStep: ColumnTableStep<FillArgs> = (input, { value, to }) => {
	const fn = (_d: any, $: any) => $.value
	return input.params({ value }).derive({ [to]: fn })
}

export const fill = stepVerbFactory(fillStep)
