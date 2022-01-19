/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from './TableStore'
import { run } from './engine'
import { factory } from './engine/verbs'
import { CompoundStep, Step, StepType, Verb } from './types'

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
export class Pipeline {
	private _store: TableStore
	private _steps: Step[]
	constructor(store: TableStore) {
		this._store = store
		this._steps = []
	}
	get store(): TableStore {
		return this._store
	}
	get steps(): Step[] {
		return [...this._steps]
	}
	get last(): Step {
		return this._steps[this._steps.length - 1]
	}
	get count(): number {
		return this._steps.length
	}
	/**
	 * Creates a new Step with a starter template based on its type
	 * @param type
	 * @param subtype
	 */
	create(type: StepType, verb: Verb): Step[] {
		const index = this.count
		const input = index === 0 ? '' : this._steps[index - 1].output
		const base: Step = factory(type, verb, input, `output-table-${index}`)
		if (type === StepType.Compound) {
			(base as CompoundStep).steps = []
		}
		return this.add(base)
	}
	add(step: Step): Step[] {
		this._steps.push(step)
		return this.steps
	}
	addAll(steps: Step[]): Step[] {
		steps.forEach(step => this._steps.push(step))
		return this.steps
	}
	clear(): void {
		// clear out any output tables if the pipeline has been run already
		this._steps.forEach(step => this._store.delete(step.output))
		this._steps = []
	}
	update(step: Step, index: number): Step[] {
		this._steps[index] = step
		return this.steps
	}
	async run(): Promise<ColumnTable> {
		return run(this._steps, this._store)
	}
}
