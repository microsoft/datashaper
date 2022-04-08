/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Value } from '../tables/types.js'
import type { InputColumnArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import type { ExprFunctionMap } from './util/types.js'

export interface ImputeArgs extends InputColumnArgs {
	/**
	 * Value to fill in empty cells
	 */
	value: Value

	columns: string[]
}

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
