/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '../boolean.js'
import { BooleanOperator } from '../types.js'
import { inputColumnList } from './inputColumnList.js'
import { outputColumn } from './outputColumn.js'

export const boolean = (): BooleanArgs => {
	return {
		operator: BooleanOperator.OR,
		...inputColumnList(),
		...outputColumn()
	}
}
