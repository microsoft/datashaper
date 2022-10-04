/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type { DataPackageSchema } from '@datashaper/schema'
import { createDataPackageSchemaObject } from '@datashaper/schema'

import { DataTable } from './DataTable.js'
import { Named } from './Named.js'
import type { SchemaResource } from './types.js'
import { isDataTable, toResourceSchema } from './utils.js'

export class DataPackage
	extends Named
	implements SchemaResource<DataPackageSchema>
{
	private _tables: Map<string, DataTable> = new Map()
	private _initPromise: Promise<void>

	public constructor(
		public dataPackage?: DataPackageSchema,
		resources?: Map<string, Blob>,
	) {
		super()
		this._initPromise = this.loadSchema(dataPackage, resources)
	}

	public initialize(): Promise<void> {
		return this._initPromise
	}

	public add(table: DataTable): void {
		this._add(table)
		this._onChange.next()
	}

	private _add(table: DataTable): void {
		let { name } = table
		this._tables.set(name, table)
		table.onChange(() => {
			if (name !== table.name) {
				this._tables.delete(name)
				this._tables.set(table.name, table)
				name = table.name

				this._onChange.next()
			}
		})
	}

	public remove(name: string): void {
		this._tables.delete(name)
		this._onChange.next()
	}

	public get(name: string): DataTable | undefined {
		return this._tables.get(name)
	}

	public get size(): number {
		return this._tables.size
	}

	public get names(): string[] {
		return [...this._tables.keys()]
	}

	public clear(): void {
		this._tables.clear()
		this._onChange.next()
	}

	public get tables(): Map<string, DataTable> {
		return this._tables
	}

	public override toSchema(): DataPackageSchema {
		return createDataPackageSchemaObject({
			...super.toSchema(),
			resources: [...this._tables.values()].map(t => t.toSchema()),
		})
	}

	public override async loadSchema(
		schema: DataPackageSchema | null | undefined,
		files?: Map<string, Blob>,
		quiet?: boolean,
	): Promise<void> {
		await super.loadSchema(schema, files, true)
		this._tables.clear()

		if (schema?.resources) {
			for (const r of schema?.resources ?? []) {
				const resource = await toResourceSchema(r, files)
				if (resource && isDataTable(resource)) {
					const table = new DataTable(resource, files)
					this._add(table)
					await table.initialize()
				}
			}
		}

		for (const table of this._tables.values()) {
			table.connect(this)
		}

		if (!quiet) {
			this._onChange.next()
		}
	}
}
