/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'

import type { Workflow } from './Workflow.js'

/**
 * A utility class for managing the inputs/outputs of a workflow for a data-table.
 * @internal
 */
export class WorkflowExecutor {
	private _workflowSubscription?: Subscription
	private _outputTable: Maybe<ColumnTable>

	/**
	 * The output of the workflow execution, or of the input source if no
	 * workflow is defined.
	 */
	public readonly output = new BehaviorSubject<Maybe<TableContainer>>(undefined)

	/**
	 * Constructs a new WorkflowExecutor instance.
	 * @param _name - The name of the data-table, used for data-source injection and table emit.
	 * @param source - The source table observable.
	 * @param inputs - Other input table observables.
	 * @param workflow - The workflow object
	 */
	constructor(
		private _name: string,
		private readonly source: BehaviorSubject<Maybe<ColumnTable>>,
		private readonly inputs: Map<string, Observable<Maybe<TableContainer>>>,
		private readonly workflow: Workflow,
	) {
		// When the source changes, re-wire it into the workflow's
		// input layer
		this.source.subscribe(table => {
			if (this.workflow.length > 0) {
				this.rebindWorkflowInput()
			} else {
				this._outputTable = table
				this.emit()
			}
		})

		// When the workflow changes, re-bind the output-table observable
		this.workflow.onChange(() => {
			if (this._workflowSubscription != null)
				this._workflowSubscription.unsubscribe()

			if (this.workflow.length > 0) {
				this._workflowSubscription = this.workflow.read()?.subscribe(tbl => {
					this._outputTable = tbl?.table
					this.emit()
				})
			} else {
				this._outputTable = this.source.value
				this.emit()
			}
		})

		this.rebindWorkflowInput()
	}

	private emit(): void {
		this.output.next({ id: this.name, table: this._outputTable })
	}

	public rebindWorkflowInput(): void {
		const inputMap = new Map(this.inputs)
		inputMap.set(
			this.name,
			this.source.pipe(
				map(table => {
					const metadata = table && introspect(table, true)
					return { id: this.name, table, metadata }
				}),
			),
		)
		this.workflow.addInputObservables(inputMap)
	}

	public get name(): string {
		return this._name
	}
	public set name(value: string) {
		this._name = value
		this.rebindWorkflowInput()
	}
}
