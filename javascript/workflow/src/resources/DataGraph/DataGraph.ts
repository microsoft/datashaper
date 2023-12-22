/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataGraphEdges, DataGraphSchema } from '@datashaper/schema'
import { KnownProfile, createDataGraphSchemaObject } from '@datashaper/schema'

import { Resource } from '../Resource.js'
import { Readable } from '../types/Readable.js'
import { dereference } from '../../predicates.js'
import { Maybe } from '../../primitives.js'
import { BehaviorSubject, Observable } from 'rxjs'
import { TableBundle } from '../TableBundle.js'
import { DataTable } from '../DataTable.js'
import { DataGraphNodes } from './DataGraphNodes.js'

export class DataGraph extends Resource {
	public readonly $schema = 'TODO'
	public readonly profile = KnownProfile.DataGraph

	public readonly nodes = new DataGraphNodes()

	private _edges$ = new BehaviorSubject<DataGraphEdges>({})

	public constructor(data?: Readable<DataGraphSchema>) {
		super()
		this.loadSchema(data)
	}

	public override defaultName(): string {
		return 'Graph'
	}

	public get nodesInput(): Maybe<TableBundle | DataTable> {
		const name = this.nodes?.input
		const ref = this.sources.find((source) => {
			const resource = dereference(source)
			return resource?.name === name
		})
		return ref && (dereference(ref) as TableBundle | DataTable)
	}

	public get edgesInput(): Maybe<TableBundle | DataTable> {
		const name = this.edges?.input
		const ref = this.sources.find((source) => {
			const resource = dereference(source)
			return resource?.name === name
		})
		return ref && (dereference(ref) as TableBundle | DataTable)
	}

	public get edges$(): Observable<DataGraphEdges> {
		return this._edges$
	}

	public get edges(): DataGraphEdges {
		return this._edges$.value
	}

	public set edges(value: DataGraphEdges) {
		this._edges$.next(value)
	}

	public override toSchema(): DataGraphSchema {
		return createDataGraphSchemaObject({
			...super.toSchema(),
			nodes: this.nodes.toSchema(),
			edges: this.edges,
		})
	}

	public override loadSchema(
		schema: Maybe<Readable<DataGraphSchema>>,
		quiet?: boolean,
	): void {
		super.loadSchema(schema, true)
		this.nodes.loadSchema(schema?.nodes, true)
		this._edges$.next(schema?.edges || {})
		if (!quiet) {
			this._onChange.next()
		}
	}
}
