/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { internal as ArqueroTypes, table } from 'arquero'
import { TableStore } from '..'
import { CompoundStep, Step, StepFunction } from '../types'
import { verb } from './verbs'

// TODO: we should just make the run method recursive
const compound = async (step: Step | CompoundStep, store: TableStore) => {
	return run((step as CompoundStep).steps, store)
}

const functions: Record<string, StepFunction> = {
	verb,
	compound,
}

/**
 * This is a fairly simplistic processing engine that executes a series of table manipulations with our verbs.
 * Most of these thunk down to Arquero directly (see the verbs folder), but they don't need to.
 * The list of steps is intended to be serializable so it can be stored or executed later or server-side.
 * Each step is async so service invocations could be inserted if necessary, such as for processing a very large step
 * or when client-side steps aren't implemented.
 * WARNING: the store is used as a chain context, and its contents are mutated.
 * @param spec
 * @param store
 * @returns
 */
export async function run(
	steps: Step[],
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	let output: ArqueroTypes.ColumnTable = table({})
	for (let index = 0; index < steps.length; index++) {
		const step = steps[index]
		try {
			output = await functions[step.type](step, store)
			store.set(step.output, output)
		} catch (e) {
			console.error(`Pipeline failed on step ${index}`, step)
			throw e
		}
	}
	// return the final table
	return output
}
