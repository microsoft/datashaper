/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@datashaper/schema'
import { MergeStrategy } from '@datashaper/schema'

import { inputColumnList } from './inputColumnList.js'
import { outputColumn } from './outputColumn.js'

export const merge = (): MergeArgs => ({
	strategy: MergeStrategy.FirstOneWins,
	...inputColumnList(),
	...outputColumn(),
})
