/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { VariableNature } from '@datashaper/schema'

/**
 * Infers the nature or "shape" of a set of values.
 * For example, it is sometimes helpful to characterize a set of number as discrete whole numbers versus continuous decimal numbers.
 * See VariableNature for descriptions of all possible natures.
 * @param values
 * @param options
 * @returns
 */
export function inferNatureFromValues(
	values: any[],
	options?: {
		/**
		 * Save time by only considering the first N values.
		 */
		limit?: number
		/**
		 * If the number of unique values is less than this number, then the variable is considered categorical.
		 * This can allow us to tune how many unique values are required to consider a variable categorical.
		 */
		categoricalCountLimit?: number
		/**
		 * If a fixed value in the list represents null, these values will be ignored when determining the nature.
		 * This is particularly useful for categorical or binary, where a real data value that means "null" could trip up our guess.
		 * For example, some datasets use 0 = false, 1 = true, and 2 = no data. This should be characterized as binary, but the third value will fool us.
		 */
		nullValue?: any
	},
): VariableNature {
	const opts = {
		limit: Infinity,
		categoricalCountLimit: 10,
		...options,
	}

	const valuesList = opts.limit < Infinity ? values.slice(0, opts.limit) : values
	const uniques = [...new Set(valuesList)].filter(
		(val) => val !== undefined && val !== null && val !== opts.nullValue,
	)

	if (uniques.length === 2) {
		return VariableNature.Binary
	}

	const isNumber = uniques.every((val) => typeof val === 'number')

	if (isNumber) {
		// if anything has a decimal, short circuit and call it continuous
		if (!uniques.every(Number.isInteger)) {
			return VariableNature.Continuous
		}

		// for us to guess that values are ordinal, we need an incrementing series of whole number with no gaps
		// note also that ordinal values are meant to represent categories, so we limit the allowed count
		if (uniques.length <= opts.categoricalCountLimit) {
			const sorted = uniques.sort((a, b) => a - b)
			let isSeries = true
			let index = 1
			while (index < sorted.length && isSeries) {
				isSeries = sorted[index] === sorted[index - 1] + 1 ? true : false
				index++
			}

			if (isSeries) return VariableNature.Ordinal
		}

		// any other list of whole numbers is considered discrete
		return VariableNature.Discrete
	}

	// this should capture most short lists of strings
	const isString = uniques.every((val) => typeof val === 'string')
	if (isString && uniques.length <= opts.categoricalCountLimit) {
		return VariableNature.Nominal
	}

	// anything unknown we'll call continuous - this could be a set of dates for example,
	// or a list of objects that don't have any definable shape,
	// or strings that are too long to be considered categorical
	return VariableNature.Continuous
}
