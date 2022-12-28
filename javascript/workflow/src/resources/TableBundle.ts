/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema, TableBundleSchema } from '@datashaper/schema'
import { KnownProfile, LATEST_TABLEBUNDLE_SCHEMA } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import { isReference } from '@datashaper/workflow'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'
import type { Workflow } from './Workflow/index.js'

import type { DataPackage } from './DataPackage/DataPackage.js'
import { Resource } from './Resource.js'
import type { ResourceReference } from './ResourceReference.js'
import type { TableEmitter, TableTransformer } from './types.js'

const dereference = (r: Resource | ResourceReference) =>
	isReference(r) ? r.target : r

const isTableEmitter = (r: Resource | undefined): r is TableEmitter => {
	return (
		r?.profile === KnownProfile.TableBundle ||
		r?.profile === KnownProfile.DataTable
	)
}

const isTableTransformer = (r: Resource | undefined): r is TableTransformer => {
	return (
		r?.profile === KnownProfile.Workflow || r?.profile === KnownProfile.Codebook
	)
}

export class TableBundle extends Resource implements TableEmitter {
	public readonly $schema = LATEST_TABLEBUNDLE_SCHEMA
	public readonly profile = KnownProfile.TableBundle

	public override defaultTitle(): string {
		return 'tablebundle.json'
	}

	private readonly _input$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private readonly _output$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private _pipelineSub?: Subscription | undefined

	public constructor(data?: TableBundleSchema) {
		super()
		this.loadSchema(data)
	}

	public override get sources(): Resource[] {
		return super.sources
	}

	public override set sources(value: Resource[]) {
		const dereferenced = value.map(dereference)
		const inputCount = dereferenced.filter(isTableEmitter).length
		if (inputCount > 1) {
			throw new Error(
				`TableBundle can only have one input, found ${inputCount}}`,
			)
		}

		this._pipelineSub?.unsubscribe()
		super.sources = value

		// Create a pipeline of transformers
		const inputNode = this.input
		const transformers = value.map(dereference).filter(isTableTransformer)

		// Wire the transformers together
		for (let i = 0; i < transformers.length; i++) {
			const t = transformers[i]
			if (t != null) {
				if (i === 0) {
					t.input$ = inputNode?.output$
				} else {
					t.input$ = transformers[i - 1]?.output$
				}
			}
		}

		const lastNode =
			transformers.length > 0
				? transformers[transformers.length - 1]
				: inputNode
		this._pipelineSub = lastNode?.output$.subscribe(out =>
			this._output$.next(this.renameTable(out)),
		)
	}

	public get input(): TableEmitter | undefined {
		return this.sources.find(source => {
			const resource = dereference(source)
			return (
				resource?.profile === KnownProfile.TableBundle ||
				resource?.profile === KnownProfile.DataTable
			)
		}) as TableEmitter | undefined
	}

	public override dispose(): void {
		this.sources.forEach(s => s.dispose())
		this._input$.complete()
		this._output$.complete()
		super.dispose()
	}

	// #region Class Fields
	public override get name(): string {
		return super.name
	}

	public override set name(value: string) {
		super.name = value
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
		if (!quiet) {
			this._onChange.next()
		}
	}

	public connect(dp: DataPackage): void {
		this.sources.forEach(s => (s as Workflow).connect?.(dp))
	}

	private renameTable = (
		table: Maybe<TableContainer>,
	): Maybe<TableContainer> => {
		return table == null ? table : { ...table, id: this.name }
	}
}
