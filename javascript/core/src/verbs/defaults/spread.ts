/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '../spread.js'
import { inputColumnList } from './inputColumnList.js'

export const spread = (): SpreadArgs => {
	return {
		...inputColumnList(),
		to: [],
	}
}
