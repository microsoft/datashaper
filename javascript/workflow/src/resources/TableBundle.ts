/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema, TableBundleSchema } from '@datashaper/schema'
import {
	CodebookStrategy,
	KnownProfile,
	LATEST_TABLEBUNDLE_SCHEMA,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { applyCodebook } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import type { Observable } from 'rxjs'
import { BehaviorSubject, EMPTY, map } from 'rxjs'

import type { Unsubscribe } from '../primitives.js'
import type { Codebook } from './Codebook.js'
import type { DataPackage } from './DataPackage/DataPackage.js'
import { Resource } from './Resource.js'
import type { TableEmitter } from './types.js'
import type { Workflow } from './Workflow/Workflow.js'

export class TableBundle extends Resource implements TableEmitter {
	public readonly $schema = LATEST_TABLEBUNDLE_SCHEMA
	public readonly profile = KnownProfile.TableBundle

	public override defaultName(): string {
		return 'tablebundle.json'
	}

	private readonly _input$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private readonly _inputs = new Map<
		string,
		Observable<Maybe<TableContainer>>
	>()
	private readonly _output$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	private _input: (Resource & TableEmitter) | undefined
	private _codebook: Codebook | undefined
	private _workflow: Workflow | undefined

	private _inputRedirectOnDispose: Unsubscribe | undefined
	private _workflowOnDispose: Unsubscribe | undefined
	private _codebookOnDispose: Unsubscribe | undefined
	private _disposeInputListeners: Unsubscribe | undefined

	public constructor(data?: TableBundleSchema) {
		super()
		this.loadSchema(data)
		this.bindDataflow()
	}

	public override get sources(): Resource[] {
		const result: Resource[] = []
		if (this.input != null && this.input.profile === KnownProfile.DataTable) {
			result.push(this.input)
		}
		if (this.codebook != null) {
			result.push(this.codebook)
		}
		if (this.workflow != null) {
			result.push(this.workflow)
		}
		return result
	}

	public override set sources(_value: Resource[]) {
		throw new Error('tablebundle sources are read-only')
	}

	public get input(): (Resource & TableEmitter) | undefined {
		return this._input
	}

	public set input(input: (Resource & TableEmitter) | undefined) {
		this._disposeInputListeners?.()
		this._input = input

		if (input != null) {
			const sub = input.output$
				// rename the container
				.pipe(map(tbl => ({ ...tbl, name: this.name } as TableContainer)))
				.subscribe(tbl => this._input$.next(this.encode(tbl)))

			const unsubOnDispose = input.onDispose(() => (this.input = undefined))
			this._disposeInputListeners = () => {
				sub.unsubscribe()
				unsubOnDispose()
			}
		}

		this.bindDataflow()
		this._onChange.next()
	}

	public get codebook(): Codebook | undefined {
		return this._codebook
	}

	public set codebook(codebook: Codebook | undefined) {
		this._codebookOnDispose?.()
		this._codebook = codebook

		if (codebook != null) {
			const unsubOnChange = codebook.onChange(() => this.bindDataflow())
			const unsubOnDispose = codebook.onDispose(
				() => (this.codebook = undefined),
			)
			this._codebookOnDispose = () => {
				unsubOnChange()
				unsubOnDispose()
			}
		}

		this.bindDataflow()
		this._onChange.next()
	}

	public get workflow(): Workflow | undefined {
		return this._workflow
	}

	public set workflow(workflow: Workflow | undefined) {
		this._workflowOnDispose?.()
		this._workflow = workflow

		if (workflow != null) {
			const unsubOnChange = workflow.onChange(() => this._onChange.next())
			const sub = workflow.read$()?.subscribe(tbl => this._output$.next(tbl))
			const unsubOnDispose = workflow.onDispose(
				() => (this.workflow = undefined),
			)

			this._workflowOnDispose = () => {
				sub.unsubscribe()
				unsubOnChange()
				unsubOnDispose()
			}
		}

		this.bindDataflow()
		this._onChange.next()
	}

	public override dispose(): void {
		this.workflow?.dispose()
		this.codebook?.dispose()
		this.input?.dispose()
		super.dispose()
	}

	// #region Class Fields
	public override get name(): string {
		return super.name
	}

	public override set name(value: string) {
		super.name = value
		this.bindDataflow()
		this._onChange.next()
	}

	// #endregion

	public get output$(): Observable<Maybe<TableContainer>> {
		return this._output$
	}

	public get output(): Maybe<TableContainer> {
		return this._output$.value
	}

	public override toSchema(): ResourceSchema {
		return {
			...super.toSchema(),
			profile: this.profile,
		}
	}

	public override loadSchema(
		schema: Maybe<TableBundleSchema>,
		quiet?: boolean,
	): void {
		super.loadSchema(schema, true)
		this._inputs.clear()

		if (!quiet) {
			this._onChange.next()
		}
	}

	public connect(dp: DataPackage): void {
		const rebindInputs = () => {
			this._inputs.clear()

			const tableNames = dp.resources
				.filter(r => r.profile === KnownProfile.TableBundle)
				.map(r => r.name)

			// Set the sibling table inputs
			tableNames.forEach(name =>
				this._inputs.set(
					name,
					(dp.getResource(name) as TableBundle)?.output$ ??
						(EMPTY as Observable<any>),
				),
			)
			// Set the input name from the source
			this._inputs.set(this.name, this._input$)
			this.bindDataflow()
		}

		dp.onChange(rebindInputs)
		rebindInputs()
	}

	private bindDataflow() {
		this._inputRedirectOnDispose?.()

		// Establish workflow inputs
		if (this.workflow != null) {
			// Set the default input to the datatable output
			if (this.input != null) {
				this.workflow.defaultInput$ = this.input.output$
			}

			// Add other named inputs from the tablestore
			this.workflow.addInputs(this._inputs)
		} else {
			// Direct the input to the output port
			const sub = this._input$.subscribe(tbl => this._output$.next(tbl))
			this._output$.next(this._input$.value)
			this._inputRedirectOnDispose = () => sub.unsubscribe()
		}
	}

	private encode(inputTable: Maybe<TableContainer>): Maybe<TableContainer> {
		if (
			inputTable?.table == null ||
			this.codebook == null ||
			this.codebook.fields.length === 0
		) {
			return inputTable
		}
		return {
			...inputTable,
			table: applyCodebook(
				inputTable.table,
				this.codebook,
				CodebookStrategy.DataTypeAndMapping,
			),
		}
	}
}
