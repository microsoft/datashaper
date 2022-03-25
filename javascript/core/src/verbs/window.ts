/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import type {
	InputColumnArgs,
	OutputColumnArgs,
	WindowFunction,
} from './types.js'
import { singleExpression } from './util/index.js'

export interface WindowArgs extends InputColumnArgs, OutputColumnArgs {
	operation: WindowFunction
}

export const windowStep: ColumnTableStep<WindowArgs> = (
	input,
	{ column, operation, to },
) => input.derive({ [to]: singleExpression(column, operation) })

export const window = stepVerbFactory(windowStep)
