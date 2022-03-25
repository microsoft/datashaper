/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export type GroupbyArgs = InputColumnListArgs

export const groupbyStep: ColumnTableStep<GroupbyArgs> = (input, { columns }) =>
	input.groupby(columns)

export const groupby = stepVerbFactory(groupbyStep)
