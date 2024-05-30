import path from 'path'
import { DataFormat, type DataTableSchema } from '@datashaper/schema'
import { readTable } from '@datashaper/tables'
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fsp from 'fs/promises'

import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import {
	CodebookProfile,
	DataTableProfile,
	TableBundleProfile,
	WorkflowProfile,
} from '../resources/index.js'

export const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0))

export function defaultProfiles() {
	return [
		new TableBundleProfile(),
		new DataTableProfile(),
		new CodebookProfile(),
		new WorkflowProfile(),
	]
}

export function readJson(dataPath: string): Promise<any> {
	return readText(dataPath).then((data) => JSON.parse(data))
}

export function readText(dataPath: string): Promise<string> {
	return fsp.readFile(dataPath, 'utf8')
}

/**
 * Uses our data table loading with a default schema,
 * so our tests are consistent with how we read files.
 * @param dataPath - should be a containing folder if the schema has a path, otherwise a full filename
 * @returns
 */
export function readDataTable(
	dataPath: string,
	schema?: DataTableSchema,
): Promise<ColumnTable | undefined> {
	const p = schema?.path ?? ''
	const filename = path.join(dataPath, p as string)
	const _schema = schema || {
		format: filename.endsWith('.csv') ? DataFormat.CSV : DataFormat.JSON,
	}
	return readText(filename).then((txt) => readTable(txt, _schema))
}
