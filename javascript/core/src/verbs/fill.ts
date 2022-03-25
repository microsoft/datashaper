/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableStep } from './nodeFactories/index.js'
import type { OutputColumnArgs } from './types.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'
import type { Value } from '../tables/types.js'

export interface FillArgs extends OutputColumnArgs {
	/**
	 * Value to fill in the new column
	 */
	value: Value
}

export const fillStep: TableStep<FillArgs> = (input, { value, to }) => {
	const fn = (_d: any, $: any) => $.value
	return input.params({ value }).derive({ [to]: fn })
}

export const fill = stepNodeFactory(fillStep)
