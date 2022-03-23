/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'
import type { ExprFunctionMap } from './types.js'

export const impute = makeStepNode<ImputeArgs>((input, { value, column }) => {
	const dArgs: ExprFunctionMap = {
		[column]: (_d: any, $: any) => $.value,
	}
	return input.params({ value }).impute(dArgs)
})
