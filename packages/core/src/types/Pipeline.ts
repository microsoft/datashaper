/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Verb } from '../types.js'
import type { TableStore } from './TableStore.js'
import type { TableContainer } from './tables.js'

// this could be used for (a) factory of step configs, (b) management of execution order
// (c) add/delete and correct reset of params, and so on

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
	get store(): TableStore
	get steps(): Step[]
	get last(): Step
	get count(): number
	get outputs(): string[]
	/**
	 * Creates a new Step with a starter template based on its type
	 * @param type
	 * @param subtype
	 */
	create(verb: Verb): Step[]
	add(step: Step): Step[]
	addAll(steps: Step[]): Step[]
	clear(): void
	delete(index: number): Step[]
	update(step: Step, index: number): Step[]
	run(): Promise<TableContainer>
	print(): void
}
