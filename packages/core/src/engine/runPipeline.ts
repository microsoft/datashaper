/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { Pipeline, TableStore } from '../'
import { Step } from '../types'

/**
 * This is a utility to execute a series of pipeline
 * steps as simply as possible, wrapping up all of the
 * store and pipeline creation internally.
 * @param input
 * @param steps
 */
export async function runPipeline(
	input: ColumnTable,
	steps: Step[],
): Promise<ColumnTable> {
	const store = new TableStore()
	const pipeline = new Pipeline(store)

	store.set('input', input)

	// TODO: step basics such as ordering and serial table input/output
	// allow user to submit the absolute simplest possible config
	pipeline.addAll(steps as Step[])

	return pipeline.run()
}
