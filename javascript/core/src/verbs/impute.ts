/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ImputeArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import type { ExprFunctionMap } from './util/types.js'

export const imputeStep: ColumnTableStep<ImputeArgs> = (
	input,
	{ value, columns },
) => {
	const dArgs: ExprFunctionMap = columns.reduce((acc, column) => {
		acc[column] = (_d: any, $: any) => $.value
		return acc
	}, {} as ExprFunctionMap)
	return input.params({ value }).impute(dArgs)
}

export const impute = stepVerbFactory(imputeStep)
