/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type { DataPackageSchema } from '@datashaper/schema'
import {
	createDataPackageSchemaObject,
	LATEST_DATAPACKAGE_SCHEMA,
} from '@datashaper/schema'

import { DataTable } from './DataTable.js'
import { Named } from './Named.js'
import { TableStore } from './TableStore.js'
import type { SchemaResource } from './types.js'
import { isDataTable, toResourceSchema } from './utils.js'

export class DataPackage
	extends Named
	implements SchemaResource<DataPackageSchema>
{
	public readonly $schema = LATEST_DATAPACKAGE_SCHEMA
	private _tableStore: TableStore = new TableStore()
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

	public clear(): void {
		this._tableStore.clear()
		this._onChange.next()
	}

	public get tableStore(): TableStore {
		return this._tableStore
	}

	public override toSchema(): DataPackageSchema {
		return createDataPackageSchemaObject({
			...super.toSchema(),
			resources: [...this._tableStore.tables.values()].map(t => t.toSchema()),
		})
	}

	public override async loadSchema(
		schema: DataPackageSchema | null | undefined,
		files?: Map<string, Blob>,
		quiet?: boolean,
	): Promise<void> {
		this.clear()
		await super.loadSchema(schema, files, true)

		if (schema?.resources) {
			for (const r of schema?.resources ?? []) {
				const resource = await toResourceSchema(r, files)
				if (resource && isDataTable(resource)) {
					const table = new DataTable(resource, files)
					this._tableStore.add(table)
					await table.initialize()
				}
			}
		}

		for (const table of this._tableStore.tables.values()) {
			table.connect(this.tableStore)
		}

		if (!quiet) {
			this._onChange.next()
		}
	}
}
