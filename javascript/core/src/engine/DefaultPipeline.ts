/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Graph } from '../graph/index.js'
import type { Step, StepInput } from '../steps/index.js'
import { step as factory } from '../steps/index.js'
import type { Store } from '../store/index.js'
import type { TableContainer } from '../tables/index.js'
import type { Verb } from '../verbs/index.js'
import { createGraph } from './graph.js'
import type { Pipeline, TableStore } from './types.js'

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
export class DefaultPipeline implements Pipeline {
	private _steps: Step[] = []
	private _graph: Graph<TableContainer>

	public constructor(public readonly store: TableStore) {
		this._graph = createGraph(this._steps, store)
	}

	public get graph(): Graph<TableContainer> {
		return this._graph
	}
	public get steps(): Step[] {
		return [...this._steps]
	}
	public get last(): Step {
		return this._steps[this._steps.length - 1]!
	}
	public get count(): number {
		return this._steps.length
	}
	public get outputs(): string[] {
		const result: string[] = []
		this._steps.forEach(s => {
			for (const value of Object.values(s.output)) {
				result.push(value)
			}
		})
		return result
	}

	public create(verb: Verb): Step[] {
		const base: Step = factory({ verb } as any)
		base.output = { target: base.id }
		return this.add(base as StepInput)
	}

	public add(step: StepInput): Step[] {
		this._steps.push(factory(step as StepInput))
		this._rebuildGraph()
		return this.steps
	}

	public addAll(steps: StepInput[]): Step[] {
		steps.forEach(step => this._steps.push(factory(step as StepInput)))
		this._rebuildGraph()
		return this.steps
	}

	public clear(): void {
		// clear out any output tables if the pipeline has been run already
		for (const step of this._steps) {
			this._unregisterStep(step)
		}
		this._steps = []
		this._rebuildGraph()
	}

	public delete(index: number): Step[] {
		const removed = this.steps.slice(index)
		const steps = this.steps.slice(0, index)
		this.clear()
		this.addAll(steps as any)

		removed.forEach(r => this._unregisterStep(r))
		this._rebuildGraph()
		return this.steps
	}

	public update(step: Step, index: number): Step[] {
		this._steps[index] = step
		this._rebuildGraph()
		return this.steps
	}

	public print(): void {
		console.log(this._steps)
	}

	private _unregisterStep(step: Step) {
		for (const value of Object.values(step.output)) {
			this.store.delete(value)
		}
	}

	private _rebuildGraph() {
		this._graph = createGraph(this._steps, this.store)
	}

	public run(): Promise<TableContainer> {
		if (this.steps.length === 0) {
			throw new Error('cannot run empty pipeline')
		}

		const lastStep = this._steps[this._steps.length - 1]!
		const lastStepOutput = lastStep.output['target'] || lastStep.id

		return new Promise<TableContainer>(resolve => {
			const unsub = this.store.onItemChange(lastStepOutput, res => {
				resolve(res as TableContainer)
				setTimeout(() => unsub(), 0)
			})
		})
	}
}

export function createPipeline(store: Store<TableContainer>): Pipeline {
	return new DefaultPipeline(store)
}
