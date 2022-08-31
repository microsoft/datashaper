/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RenameArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const renameStep: ColumnTableStep<RenameArgs> = (input, { columns }) =>
	input.rename(columns)

export const rename = stepVerbFactory(renameStep)
