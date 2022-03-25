/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnTableStep } from './util/factories.js'
import type { InputColumnListArgs } from './types.js'
import { stepNodeFactory } from './util/factories.js'

export type GroupbyArgs = InputColumnListArgs

export const groupbyStep: ColumnTableStep<GroupbyArgs> = (input, { columns }) =>
	input.groupby(columns)

export const groupby = stepNodeFactory(groupbyStep)
