/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableStep } from './nodeFactories/index.js'
import { compareAll } from './util/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'
import type { OutputColumnArgs } from './types.js'
import type { FilterArgs } from './filter.js'

export interface BinarizeArgs extends FilterArgs, OutputColumnArgs {}

export const binarizeStep: TableStep<BinarizeArgs> = (
	input,
	{ to, column, criteria, logical },
) => input.derive({ [to]: compareAll(column, criteria, logical) })

export const binarize = stepNodeFactory(binarizeStep)
