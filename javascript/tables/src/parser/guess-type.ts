/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TypeHints } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'

import { validator } from './validators.js'

export function guessType(options?: TypeHints): (value: string) => DataType {
	const { isNull, isBoolean, isNumber, isArray, isObject, isDate } =
		validator(options)
	return function (value: string) {
		if (isNull(value)) {
			return DataType.Null
		}
		if (isNumber(value)) {
			return DataType.Number
		}
		if (isBoolean(value)) {
			return DataType.Boolean
		}
		if (isDate(value)) {
			return DataType.Date
		}
		if (isArray(value)) {
			return DataType.Array
		}
		if (isObject(value)) {
			return DataType.Object
		}
		if (value === DataType.Undefined) {
			return DataType.Undefined
		}
		return DataType.String
	}
}
