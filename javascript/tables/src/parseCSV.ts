/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CodebookSchema, TypeHints } from '@datashaper/schema'
import { TypeHintsDefaults } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { parseAs } from './parseTypes.js'

export interface ParseConfig {
	codebook?: Partial<CodebookSchema>
	typeHints?: TypeHints
}

export function parseCSV(csv: string, options?: ParseConfig): ColumnTable {
	const codebook = options?.codebook
	const typeHints = options?.typeHints || TypeHintsDefaults
	const parseConfig = codebook?.fields?.reduce(
		(acc: Record<string, any>, { name, type }) => {
			acc[name] = parseAs(type, typeHints)
			return acc
		},
		{},
	)
	return fromCSV(csv, {
		parse: parseConfig,
	})
}
