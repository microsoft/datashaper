/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ColumnTableStep } from './util/factories.js'
import { compareAll } from './util/index.js'
import { stepNodeFactory } from './util/factories.js'
import type { OutputColumnArgs } from './types.js'
import type { FilterArgs } from './filter.js'

export interface BinarizeArgs extends FilterArgs, OutputColumnArgs {}

export const binarizeStep: ColumnTableStep<BinarizeArgs> = (
	input,
	{ to, column, criteria, logical },
) => input.derive({ [to]: compareAll(column, criteria, logical) })

export const binarize = stepNodeFactory(binarizeStep)
