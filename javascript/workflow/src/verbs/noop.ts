/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NoopArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const noopStep: ColumnTableStep<NoopArgs> = (input, { message }) => {
	console.log(message)
	input.print()
	return input
}

export const noop = stepVerbFactory(noopStep)
