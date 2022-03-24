/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'

export function fixedBinCount(
	column: string,
	min: number,
	max: number,
	count: number,
	clamped?: boolean,
	distinct?: number,
): string | object {
	const step = (max - min) / count
	return fixedBinStep(column, min, max, step, clamped, distinct)
}

export function fixedBinStep(
	column: string,
	min: number,
	max: number,
	step: number,
	clamped?: boolean,
	distinct?: number,
): string | object {
	const count = Math.ceil((max - min) / step)
	const ultimate = min + step * count
	const penultimate = min + step * (count - 1)
	// if the ultimate bin is >= the max, put those values in the prior bin
	// this is due to arquero's exclusive max bound, which will just bin those exact
	// matches into the final bin, disrupting the expected bin count by adding one
	const rebinmax = ultimate >= max
	const nobin = distinct !== undefined && distinct <= count
	return escape((d: any) => {
		const value = d[column]
		if (nobin) {
			return value
		}
		const candidate = op.bin(value, min, max, step)
		if (clamped) {
			if (candidate === -Infinity) {
				return min
			} else if (candidate === Infinity) {
				return rebinmax ? penultimate : ultimate
			}
		}
		return candidate === max && rebinmax ? penultimate : candidate
	})
}
