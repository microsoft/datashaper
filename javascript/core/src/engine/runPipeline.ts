/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import isArray from 'lodash-es/isArray.js'
import { createTableStore } from '../factories.js'
import { createPipeline } from '../index.js'
import type { Step, TableContainer } from '../types.js'

/**
 * This is a utility to execute a series of pipeline
 * steps as simply as possible, wrapping up all of the
 * store and pipeline creation internally.
 * @param input
 * @param steps
 */
export async function runPipeline(
	input: ColumnTable,
	steps: Step | Step[],
): Promise<TableContainer> {
	const store = createTableStore()
	const pipeline = createPipeline(store)

	// make sure each step has an input/output
	// if missing we'll just chain them sequentially
	// TODO: do this recusively for compound steps as well
	const internal = (isArray(steps) ? steps : [steps]).map((step, idx, arr) => {
		const copy = {
			...step,
		}
		if (idx === 0) {
			if (!copy.input) {
				copy.input = 'input'
			}
		} else {
			const prev = arr[idx - 1] as Step<unknown>
			if (!copy.input) {
				copy.input = prev.output || `table-${idx - 1}`
			}
		}
		if (!copy.output) {
			copy.output = `table-${idx}`
		}
		return copy
	})

	// since we're creating the store the user has no opportunity
	// to add the starting table, so we'll put it in place
	const inp = internal[0]!.input
	store.set({ id: inp, table: input })

	pipeline.addAll(internal as Step[])

	return pipeline.run()
}
