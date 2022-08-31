/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GroupbyArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const groupbyStep: ColumnTableStep<GroupbyArgs> = (input, { columns }) =>
	input.groupby(columns)

export const groupby = stepVerbFactory(groupbyStep)
