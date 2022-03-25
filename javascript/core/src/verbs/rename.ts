/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnRecordArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export type RenameArgs = InputColumnRecordArgs

export const renameStep: ColumnTableStep<RenameArgs> = (input, { columns }) =>
	input.rename(columns)

export const rename = stepVerbFactory(renameStep)
