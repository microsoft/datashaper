/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PrintArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const printStep: ColumnTableStep<PrintArgs> = (input, { message }) => {
	console.log(message)
	input.print()
	return input
}

export const print = stepVerbFactory(printStep)
