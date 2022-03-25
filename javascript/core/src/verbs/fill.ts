/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ColumnTableStep } from './util/factories.js'
import type { OutputColumnArgs } from './types.js'
import { stepVerbFactory } from './util/factories.js'
import type { Value } from '../tables/types.js'

export interface FillArgs extends OutputColumnArgs {
	/**
	 * Value to fill in the new column
	 */
	value: Value
}

export const fillStep: ColumnTableStep<FillArgs> = (input, { value, to }) => {
	const fn = (_d: any, $: any) => $.value
	return input.params({ value }).derive({ [to]: fn })
}

export const fill = stepVerbFactory(fillStep)
