/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import toNumber from 'lodash-es/toNumber.js'

import { DECIMAL_DEFAULT, THOUSANDS_DEFAULT } from './typeHints.defaults.js'

export function formatNumberStr(
	value: string,
	decimal = DECIMAL_DEFAULT,
	thousands = THOUSANDS_DEFAULT,
): string {
	return value.toString().replaceAll(thousands, '').replace(decimal, '.')
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
