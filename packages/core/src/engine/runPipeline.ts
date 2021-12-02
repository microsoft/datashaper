/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'
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
	input: ArqueroTypes.ColumnTable,
	steps: Step[],
): Promise<ArqueroTypes.ColumnTable> {
	const store = new TableStore()
	const pipeline = new Pipeline(store)

	store.set('input', input)

	// TODO: step basics such as ordering and serial table input/output
	// allow user to submit the absolute simplest possible config
	pipeline.addAll(steps as Step[])

	return pipeline.run()
}
