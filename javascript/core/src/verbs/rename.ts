/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnTableStep } from './util/factories.js'
import type { InputColumnRecordArgs } from './types.js'
import { stepNodeFactory } from './util/factories.js'

export type RenameArgs = InputColumnRecordArgs

export const renameStep: ColumnTableStep<RenameArgs> = (input, { columns }) =>
	input.rename(columns)

export const rename = stepNodeFactory(renameStep)
