/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import type { ExprFunctionMap } from './types.js'

const doImpute = wrapColumnStep<ImputeArgs>((input, { value, columns }) => {
	const dArgs: ExprFunctionMap = columns.reduce((acc, column) => {
		acc[column] = (_d: any, $: any) => $.value
		return acc
	}, {} as ExprFunctionMap)
	return input.params({ value }).impute(dArgs)
})

export const impute = makeStepFunction(doImpute)
export const imputeNode = makeStepNode(doImpute)
