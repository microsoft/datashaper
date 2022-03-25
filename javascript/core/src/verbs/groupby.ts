/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnListArgs } from './types.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export type GroupbyArgs = InputColumnListArgs

export const groupbyStep: TableStep<GroupbyArgs> = (input, { columns }) =>
	input.groupby(columns)

export const groupby = stepNodeFactory(groupbyStep)
