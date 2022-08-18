/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@datashaper/schema'
import { BooleanOperator } from '@datashaper/schema'

import { inputColumnList } from './inputColumnList.js'
import { outputColumn } from './outputColumn.js'

export const boolean = (): BooleanArgs => ({
	operator: BooleanOperator.OR,
	...inputColumnList(),
	...outputColumn(),
})
