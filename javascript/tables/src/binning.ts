/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'

/**
 * Bins column values using a fixed number of bins.
 * The standard behavior here is to truncate a numeric value to the
 * lower bound of its bin range. This keeps the output numerical
 * but loses information about specific bin boundaries.
 * Because binning is a conversion from continuous to categorical,
 * many use cases prefer an output value that displays the range.
 * The format parameter here will produce a printed string as output.
 * @param column - name of the column to bin
 * @param min - inclusive minimum of the bin range
 * @param max - inclusive maximum of the bin range
 * @param count - number of bins to create, they will be equal width
 * @param clamped - whether values outside of the bin range should be clamped to the bounds. If this is false, out-of-bounds values will be +/-Infinity.
 * @param format - whether to return a formatted string that prints the bin range.
 * @returns
 */
export function fixedBinCount(
	column: string,
	min: number,
	max: number,
	count: number,
	clamped = false,
	format = false,
): string | object {
	const step = (max - min) / count
	return fixedBinStep(column, min, max, step, clamped, format)
}

/**
 * Bins column values using a fixed bin width. The number of resulting bins is therefore variable.
 * The standard behavior here is to truncate a numeric value to the
 * lower bound of its bin range. This keeps the output numerical
 * but loses information about specific bin boundaries.
 * Because binning is a conversion from continuous to categorical,
 * many use cases prefer an output value that displays the range.
 * The format parameter here will produce a printed string as output.
 * @param column - name of the column to bin
 * @param min - inclusive minimum of the bin range
 * @param max - inclusive maximum of the bin range
 * @param step - the width each bin should be
 * @param clamped - whether values outside of the bin range should be clamped to the bounds. If this is false, out-of-bounds values will be +/-Infinity.
 * @param format - whether to return a formatted string that prints the bin range.
 * @returns
 */
export function fixedBinStep(
	column: string,
	min = 0,
	max = 0,
	step = 0,
	clamped = false,
	format = false,
): string | object {
	const binFn = bin(min, max, step, clamped)
	return escape((d: any) => {
		const value = binFn(d[column])
		if (format) {
			if (value < min) {
				return `<${min}`
			}
			if (value > max) {
				return `>${max}`
			}
			const top = value + step
			// our final bin is inclusive of the max value,
			// so change the wording for last bin
			if (value >= max - step) {
				return `${value} to ${top > max ? max : top}`
			}
			return `${value} to <${top}`
		}
		return value
	})
}

/**
 * Returns a function that places values in an actual bin, by truncating it to the lower bound.
 * This differs slightly from arquero by not using an exclusive max at the top end,
 * which would always result in one more bin than desired.
 * Our approach aligns with the behavior of numpy.
 * https://numpy.org/doc/stable/reference/generated/numpy.histogram.html
 */
function bin(min: number, max: number, step: number, clamped: boolean) {
	const count = Math.floor((max - min) / step)
	const ultimate = min + step * count
	const penultimate = min + step * (count - 1)
	const adjust_bin_max = ultimate >= max
	return function (value: number): number {
		// if the ultimate bin is >= the max, put those values in the prior bin
		// this is due to arquero's exclusive max bound, which will just bin those exact
		// matches into the final bin, disrupting the expected bin count by adding one
		const candidate = op.bin(value, min, max, step)

		if (clamped) {
			if (candidate === -Infinity) {
				return min
			} else if (candidate === Infinity) {
				return adjust_bin_max ? penultimate : ultimate
			}
		}

		if (candidate === -Infinity || candidate === Infinity) {
			return candidate
		}

		if (candidate >= max) {
			return penultimate
		}

		return candidate
	}
}
