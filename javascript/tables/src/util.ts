/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TypeHintsDefaults } from '@datashaper/schema'
import toNumber from 'lodash-es/toNumber.js'

export function formatNumberStr(
	value: string | number,
	decimal = TypeHintsDefaults.decimal,
	thousands = TypeHintsDefaults.thousands,
): string {
	if (typeof value === 'number') {
		value = value.toString()
	}
	return value.replaceAll(thousands, '').replace(decimal, '.')
}

export function getDate(value: string): Date {
	const ms = toNumber(value)
	/** Validate milliseconds string */
	if (!isNaN(ms)) {
		return new Date(ms)
	}
	return new Date(value)
}

export function isValidNumber(value: string): boolean {
	return /^(-{0,1})[0-9.]*$/.test(value)
}
