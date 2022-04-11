/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Graph } from '../graph/index.js'
import type { Step } from '../steps/index.js'
import type { Store } from '../store/index.js'
import type { TableContainer } from '../tables/index.js'
import type { Verb } from '../verbs/index.js'

// this could be used for (a) factory of step configs, (b) management of execution order
// (c) add/delete and correct reset of params, and so on

export type TableStore = Store<TableContainer>
/**
 * Manages a series of pipeline steps,
 * including creating default names, executing in order, etc.
 * This and the accompanying TableStore are very similar to Arquero's
 * notion of queries. Both are basically a chain pattern with context.
 * We deviate here in order to support some specific needs, such as:
 * - not wanting to be completely wedded to Arquero
 * - wanting async so we can lazy-load tables or invoke services
 * - building compound steps with recursive execution.
 * TODO: this could hide the TableStore for easier api use, and just provide proxy methods.
 */
export interface Pipeline {
	readonly store: TableStore
	readonly steps: Step[]
	readonly last: Step
	readonly count: number
	readonly outputs: string[]
	readonly graph: Graph<TableContainer>

	/**
	 * Creates a new Step with a starter template based on its type
	 * @param verb - the type of verb step to create
	 */
	create(verb: Verb): Step[]

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	add(step: Step): Step[]

	/**
	 * Adds steps to the pipeline
	 * @param steps - The steps to add
	 */
	addAll(steps: Step[]): Step[]

	/**
	 * Remove all steps from the pipeline
	 */
	clear(): void

	/**
	 * Deletes steps from the given index (inclusive) to the end of the array
	 * @param index - The index to delete after
	 */
	delete(index: number): Step[]

	/**
	 *
	 * @param step The updated step
	 * @param index The step index to update
	 */
	update(step: Step, index: number): Step[]

	run(): Promise<TableContainer>

	/**
	 * Log out the steps
	 */
	print(): void
}
