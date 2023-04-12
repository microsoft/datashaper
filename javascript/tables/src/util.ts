/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TypeHintsDefaults } from '@datashaper/schema'
import toNumber from 'lodash-es/toNumber.js'

/**
 * Formats a string using specified numeric parser options,
 * so that it is ready for standard numeric parsing.
 * (i.e., default js impl is to consider '.' a decimal).
 * If the string has invalid construction to be a number,
 * an empty string will be returned, which will be parsed as NaN.
 * We do this because parseInt does not recognize the thousands separator,
 * but if we remove them all even in invalid cases (e.g., '1,00'), invalid
 * numbers could be parsed downstream as valid.
 * The same occurs with decimal separators: parseFloat will ignore anything after the first.
 * @param value
 * @param options
 * @returns
 */
export function formatNumberStr(
	value: string | number,
	options: {
		decimal?: string
		thousands?: string
	} = {},
): string {
	const {
		decimal = TypeHintsDefaults.decimal,
		thousands = TypeHintsDefaults.thousands,
	} = options
	if (typeof value === 'number') {
		value = value.toString()
	}
	// first, replace any custom separators with standard JS defaults
	// the use of temp separators is to handle swapping , and . directly
	// TODO: this could all be cleaner with a complex Regexp...
	// allow leading zeros, but don't replace if the entire value is a zero string.
	let template = value === '0' ? value : value.replace(/^0+/, '')
	if (decimal && decimal !== '.') {
		template = template.replaceAll(decimal, '<d>')
	}

	// by default a non-specified thousands separator is not allowed
	// do this test after the decimal replacement in case the decimal is a comma
	if (!thousands) {
		if (/,/.test(template)) {
			return ''
		}
	}
	if (thousands && thousands !== ',') {
		template = template.replaceAll(thousands, '<t>')
	}

	template = template.replaceAll('<t>', ',').replaceAll('<d>', '.')

	// ensure that there is not more than 1 decimal point
	if (/((\d)+\.){2,}?/.test(template)) {
		return ''
	}

	// test that the thousands separator is a valid construction left of the decimal
	// (optional 1-3 for first group, only 3 exactly for subsequent groups)
	const parts = template.split('.')
	const splits = parts[0].split(',')
	// first split in any thousands notation can be 0-3
	if (splits && splits.length > 1) {
		if (splits[0].length > 3) {
			return ''
		}
		for (let i = 1; i < splits.length; i++) {
			if (splits[i].length !== 3) {
				return ''
			}
		}
	}

	return template.replaceAll(',', '')
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
