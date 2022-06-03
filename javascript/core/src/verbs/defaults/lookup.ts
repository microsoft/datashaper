/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupArgs } from '../lookup.js'
import { inputColumnList } from './inputColumnList.js'

export const lookup = (): LookupArgs => ({
	on: [],
	...inputColumnList(),
})
