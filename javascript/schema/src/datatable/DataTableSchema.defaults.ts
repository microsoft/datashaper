/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat } from '../data.js'
import { KnownProfile } from '../enums/index.js'
import type { DataTableSchema } from './DataTableSchema.js'
import { ParserOptionsDefaults } from './ParserOptions.defaults.js'
import { TypeHintsDefaults } from './TypeHints.defaults.js'

export const DataTableSchemaDefaults: Partial<DataTableSchema> = {
	profile: KnownProfile.DataTable,
	format: DataFormat.CSV,
	encoding: 'utf-8',
	parser: ParserOptionsDefaults,
	typeHints: TypeHintsDefaults,
}
