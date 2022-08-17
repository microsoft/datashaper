/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { compareAll } from './util/index.js'

export const binarizeStep: ColumnTableStep<BinarizeArgs> = (
	input,
	{ to, column, criteria, logical },
) => input.derive({ [to]: compareAll(column, criteria, logical) })

export const binarize = stepVerbFactory(binarizeStep)
