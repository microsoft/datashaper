/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import type { Graph } from '@essex/dataflow'
import type { Observable } from 'rxjs'

import type { Maybe } from '../primitives.js'
import type { NamedPortBinding } from '../specification.js'
import type { Step, StepInput } from '../steps/index.js'
import type { ParsedSpecification } from '../steps/types.js'
import type { Store } from '../store/index.js'

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
export interface GraphBuilder {
	readonly store: Store<TableContainer>
	readonly graph: Graph<TableContainer>
	readonly spec: ParsedSpecification

	/**
	 * Remove all steps, inputs, and outputs from the pipeline
	 */
	clear(): void

	/**
	 * Add a named input
	 */
	addInput(input: string): void

	/**
	 * Removes a named input
	 * @param input - The input name to remove
	 */
	removeInput(input: string): void

	/**
	 * Add an output binding
	 * @param name - The output name to register
	 * @param binding - The output binding
	 */
	addOutput(name: string, binding: NamedPortBinding): void

	/**
	 * Remove an output binding
	 * @param name
	 */
	removeOutput(name: string): void

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	addStep(step: StepInput): Step

	/**
	 * Deletes steps from the given index (inclusive) to the end of the array
	 * @param index - The index to delete after
	 */
	removeStep(index: number): void

	/**
	 * Reconfigure a step at an index
	 * @param index - The step index
	 * @param step - The step specification
	 */
	reconfigureStep(index: number, step: StepInput): void

	/**
	 * Observe a table name
	 * @param name - The table name to observe
	 */
	table(name: string): Observable<Maybe<TableContainer>>

	/**
	 * Log out the steps
	 */
	print(): void
}
