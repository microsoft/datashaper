/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ColumnTableStep } from './util/factories.js'
import type { InputColumnArgs } from './types.js'
import type { ExprFunctionMap } from './util/types.js'
import { stepNodeFactory } from './util/factories.js'
import type { Value } from '../tables/types.js'

export interface ImputeArgs extends InputColumnArgs {
	/**
	 * Value to fill in empty cells
	 */
	value: Value
}

export const imputeStep: ColumnTableStep<ImputeArgs> = (
	input,
	{ value, column },
) => {
	const dArgs: ExprFunctionMap = {
		[column]: (_d: any, $: any) => $.value,
	}
	return input.params({ value }).impute(dArgs)
}

export const impute = stepNodeFactory(imputeStep)
