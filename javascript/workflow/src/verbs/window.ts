/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { singleExpression } from './util/index.js'

export const windowStep: ColumnTableStep<WindowArgs> = (
	input,
	{ column, operation, to },
) => input.derive({ [to]: singleExpression(column, operation) })

export const window = stepVerbFactory(windowStep)
