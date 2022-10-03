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
	private _tables: DataTable[] = []

	public constructor(
		public dataPackage?: DataPackageSchema,
		resources?: Map<string, Blob>,
	) {
		super()
		this.loadSchema(dataPackage, resources)
	}

	public addTable(table: DataTable): void {
		this._tables.push(table)
		this._onChange.next()
	}

	public removeTable(table: DataTable): void {
		this._tables = this._tables.filter(t => t !== table)
		this._onChange.next()
	}

	public override toSchema(): DataPackageSchema {
		return createDataPackageSchemaObject({
			...super.toSchema(),
			resources: this._tables.map(t => t.toSchema()),
		})
	}

	public override async loadSchema(
		schema: DataPackageSchema | null | undefined,
		resources?: Map<string, Blob>,
		quiet?: boolean,
	): Promise<void> {
		await super.loadSchema(schema, resources, true)
		this._tables = []

		if (schema?.resources) {
			for (const r of schema?.resources ?? []) {
				const resource = await toResourceSchema(r, resources)
				if (resource && isDataTable(resource)) {
					this._tables.push(new DataTable(resource, resources))
				}
			}
		}

		if (!quiet) {
			this._onChange.next()
		}
	}
}
