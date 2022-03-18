/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StepDescriptionProps } from '../index.js'
import type { DescriptionRow } from '../types.js'

// this is the maximum rows a verb description can show.
// it is based on the max core requirement, currently held by BIN
// setting this max ensures that no verbs with arbitrary-legnth arguments
// (usually column lists) can grow too large
const MAX_ROWS = 9
/**
 * Executes provided print function on a list to create a series of display entries.
 * Uses the max to limit how many rows are returned to print, but stringifies the entire list
 * to use as a tooltip/title.
 * @param print -
 * @param others - number of other rows besides this generated list
 */
export function createRowEntries<T>(
	list: T[],
	print: (obj: T) => DescriptionRow,
	others: number,
	props: StepDescriptionProps,
): DescriptionRow[] {
	let max = MAX_ROWS - others
	if (props.showInput) {
		max--
	}
	if (props.showOutput) {
		max--
	}
	const all = list.map(print)
	const rows = all.slice(0, max)
	const remaining = all.length - rows.length
	if (remaining > 0) {
		// +1 to remaining because adding this row will replace another
		rows.splice(max - 1, 2, {
			before: `+${remaining + 1} more...`,
			value: '',
			title: all
				.slice(max - 1)
				.map(d => [d.before, d.value, d.after].join(' '))
				.join('\n'),
		})
	}
	return rows
}
