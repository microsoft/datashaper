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
