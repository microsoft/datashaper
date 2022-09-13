/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Codebook, TypeHints } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { parseAs } from './parseTypes.js'
import {
	DATE_FORMAT_DEFAULT,
	DECIMAL_DEFAULT,
	FALSE_DEFAULTS,
	NA_DEFAULTS,
	THOUSANDS_DEFAULT,
	TRUE_DEFAULTS,
} from './typeHints.defaults.js'

const defaultTypeHints = {
	trueValues: TRUE_DEFAULTS,
	falseValues: FALSE_DEFAULTS,
	naValues: NA_DEFAULTS,
	dateFormat: DATE_FORMAT_DEFAULT,
	thousands: THOUSANDS_DEFAULT,
	decimal: DECIMAL_DEFAULT,
}

export interface ParseConfig {
	codebook?: Codebook
	typeHints?: TypeHints
}

export function parseCSV(csv: string, options?: ParseConfig): ColumnTable {
	const codebook = options?.codebook
	const typeHints = options?.typeHints || defaultTypeHints
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
