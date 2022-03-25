/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnListArgs } from './types.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export interface FoldArgs extends InputColumnListArgs {
	/**
	 * Two-element array of names for the output [key, value]
	 */
	to?: [string, string]
}

export const foldStep: TableStep<FoldArgs> = (input, { columns, to }) =>
	input.fold(columns, { as: to })

export const fold = stepNodeFactory(foldStep)
