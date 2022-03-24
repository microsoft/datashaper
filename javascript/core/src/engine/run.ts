/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '../steps/index.js'
import type { Store } from '../store/index.js'
import type { TableContainer } from '../tables/types.js'

/**
 * This is a fairly simplistic processing engine that executes a series of table manipulations with our verbs.
 * Most of these thunk down to Arquero directly (see the verbs folder), but they don't need to.
 * The list of steps is intended to be serializable so it can be stored or executed later or server-side.
 * Each step is async so service invocations could be inserted if necessary, such as for processing a very large step
 * or when client-side steps aren't implemented.
 * WARNING: the store is used as a chain context, and its contents are mutated.
 * @param spec -
 * @param store -
 * @returns
 */
export async function run(
	steps: Step[],
	_store: Store<TableContainer>,
): Promise<TableContainer> {
	await Promise.resolve()
	if (steps.length === 0) {
		throw new Error('no steps in chain')
	}
	// TODO: serialize to a graph and emit the output table
	// return chain(
	// 	{
	// 		verb: Verb.Chain,
	// 		input: steps[0]!.input,
	// 		output: steps[steps.length - 1]!.output,
	// 		args: {
	// 			steps,
	// 			nofork: true,
	// 		},
	// 	},
	// 	store,
	// )
	return null as any
}

// steps + store to create graph
// some inputs injected after graph creation(e.g. read JSON)
// watch for named outputs
