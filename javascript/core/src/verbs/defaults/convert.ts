/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '../convert.js'
import { ParseType } from '../types.js'
import { inputColumnList } from './inputColumnList.js'

export const convert = (): ConvertArgs => {
	return {
		type: ParseType.Decimal,
		formatPattern: '%Y-%m-%d',
		...inputColumnList(),
	}
}
