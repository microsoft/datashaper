/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataGraphSchema } from '@datashaper/schema'
import { KnownProfile, createDataGraphSchemaObject } from '@datashaper/schema'

import { Resource } from '../Resource.js'
import { Readable } from '../types/Readable.js'
import { dereference } from '../../predicates.js'
import { Maybe } from '../../primitives.js'
import { TableBundle } from '../TableBundle.js'
import { DataTable } from '../DataTable.js'
import { DataGraphNodes } from './DataGraphNodes.js'
import { DataGraphEdges } from './DataGraphEdges.js'
import { BehaviorSubject, Observable } from 'rxjs'
import type { TableContainer } from '@datashaper/tables'

export class DataGraph extends Resource {
	public readonly $schema = 'TODO'
	public readonly profile = KnownProfile.DataGraph

	public readonly nodes = new DataGraphNodes()
	public readonly edges = new DataGraphEdges()

	private readonly _nodesInput$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private readonly _edgesInput$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	public constructor(data?: Readable<DataGraphSchema>) {
		super()
		this.loadSchema(data)

		this.nodes.input$.subscribe((input) => {
			if (input) {
				const table = this.findInput(input)
				table?.output$.subscribe((output) => {
					this._nodesInput$.next(output)
				})
			}
		})

		this.edges.input$.subscribe((input) => {
			if (input) {
				const table = this.findInput(input)
				table?.output$.subscribe((output) => {
					this._edgesInput$.next(output)
				})
			}
		})
	}

	public override defaultName(): string {
		return 'Graph'
	}

	public get nodesInput$(): Observable<Maybe<TableContainer>> {
		return this._nodesInput$
	}

	public get nodesInput(): Maybe<TableContainer> {
		return this._nodesInput$.value
	}

	public get edgesInput$(): Observable<Maybe<TableContainer>> {
		return this._edgesInput$
	}

	public get edgesInput(): Maybe<TableContainer> {
		return this._edgesInput$.value
	}

	private findInput(name: string): Maybe<TableBundle | DataTable> {
		const ref = this.sources.find((source) => {
			const resource = dereference(source)
			return resource?.name === name
		})
		return ref && (dereference(ref) as TableBundle | DataTable)
	}

	public override toSchema(): DataGraphSchema {
		return createDataGraphSchemaObject({
			...super.toSchema(),
			nodes: this.nodes.toSchema(),
			edges: this.edges.toSchema(),
		})
	}

	public override loadSchema(
		schema: Maybe<Readable<DataGraphSchema>>,
		quiet?: boolean,
	): void {
		super.loadSchema(schema, true)
		this.nodes.loadSchema(schema?.nodes, true)
		this.edges.loadSchema(schema?.edges, true)
		if (!quiet) {
			this._onChange.next()
		}
	}
}
