/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isArray, isDate } from 'lodash'
import { DataType, Value } from '..'

/**
 * Guess the type of a table value with more discernment than typeof
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 * @param value
 * @returns
 */
export function determineType(value: Value): DataType {
	const type = typeof value as string
	if (type === 'object') {
		if (isDate(value)) {
			return DataType.Date
		} else if (isArray(value)) {
			return DataType.Array
		}
	}
	return type as DataType
}

/**
 * Ensure an incoming value matches its datatype.
 * For example, if user input is from a textfield, parse it.
 * @param value
 * @param dataType
 */
export function coerce(value: Value, dataType: DataType): Value {
	switch (dataType) {
		case DataType.Number:
			return Number.parseFloat(value)
		case DataType.Date:
			return new Date(value)
		case DataType.Boolean:
			return !!value
		default:
			return value
	}
}
