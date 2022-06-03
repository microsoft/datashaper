/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '../merge.js'
import { MergeStrategy } from '../merge.js'
import { inputColumnList } from './inputColumnList.js'
import { outputColumn } from './outputColumn.js'

export const merge = (): MergeArgs => {
	return {
		strategy: MergeStrategy.FirstOneWins,
		...inputColumnList(),
		...outputColumn(),
	}
}
