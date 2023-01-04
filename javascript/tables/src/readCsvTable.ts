/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema} from '@datashaper/schema';
import { DataTableSchemaDefaults } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import merge from 'lodash-es/merge.js'

import { getParser, validOptions } from './readCsvTable.utils.js'

/**
 * Reads CSV text into an arquero table.
 * Switches between arquero's CSV parser and papaparse based on the options.
 * (Arquero is faster but supports fewer options).
 * @param text
 * @param options
 * @returns
 */
export function readCsvTable(
	text: string,
	schema?: Partial<DataTableSchema>,
	autoType = true,
	autoMax = 1000,
): ColumnTable {
	const valid = validOptions(schema?.parser)
	const _schema = defaultSchema(schema)
	if (!valid) {
		throw new Error('Some opts are not valid')
	}
	const parser = getParser(_schema.parser)
	return parser(text, _schema.parser, autoType, autoMax)
}

function defaultSchema(
	schema?: Partial<DataTableSchema>,
): Partial<DataTableSchema> {
	return merge({}, DataTableSchemaDefaults, schema)
}
