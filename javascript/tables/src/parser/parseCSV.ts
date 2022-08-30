/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Codebook, TypeHints } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import {
	commentDefault,
	dateFormatDefault,
	decimalDefault,
	delimiterDefault,
	falseDefaults,
	naDefaults,
	thousandsDefault,
	trueDefaults,
} from './defaults.js'
import { parseAs } from './parser.js'

const defaultTypeHints = {
	delimiter: delimiterDefault,
	trueValues: trueDefaults,
	falseValues: falseDefaults,
	naValues: naDefaults,
	dateFormat: dateFormatDefault,
	thousands: thousandsDefault,
	decimal: decimalDefault,
	comment: commentDefault,
}

export function parseCSV(
	csv: string,
	schema: Codebook,
	typeHints: TypeHints = defaultTypeHints,
): ColumnTable {
	const parseConfig = schema.fields.reduce(
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
