/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnRecordArgs } from './types.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export type RenameArgs = InputColumnRecordArgs

export const renameStep: TableStep<RenameArgs> = (input, { columns }) =>
	input.rename(columns)

export const rename = stepNodeFactory(renameStep)
