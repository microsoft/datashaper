/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeArgs } from '../binarize.js'
import { filter } from './filter.js'
import { outputColumn } from './outputColumn.js'

export const binarize = (): Omit<BinarizeArgs, 'column'> => ({
	...outputColumn(),
	...filter(),
})
