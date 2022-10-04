/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ParserOptions } from '@datashaper/schema'
import { from, fromCSV } from 'arquero'
import type { CSVParseOptions } from 'arquero/dist/types/format/from-csv'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { uniq } from 'lodash-es'
import { type ParseConfig,default as papa } from 'papaparse'

import {
	ARQUERO_PROPS_MAP,
	ARQUERO_SUPPORTED_OPTS,
	LINE_TERMINATORS,
	PAPAPARSE_PROPS_MAP,
} from './readTable.constants.js'
import { ParserType } from './readTable.types.js'

export function determineParserType(options?: ParserOptions) {
	if (!options || hasArqueroOptions(options)) {
		return ParserType.Arquero
	} else {
		return ParserType.PapaParse
	}
}

export function getParser(options?: ParserOptions) {
	const type = determineParserType(options)
	switch (type) {
		case ParserType.PapaParse:
			return papaParser
		case ParserType.Arquero:
		default:
			return arqueroParser
	}
}

function arqueroParser(text: string, options: ParserOptions = {}): ColumnTable {
	const mappedOptions = mapProps(ParserType.Arquero, options) as CSVParseOptions
	const table = fromCSV(text, mappedOptions)
	return options.readRows ? table.slice(0, options.readRows) : table
}

function papaParser(text: string, options: ParserOptions = {}): ColumnTable {
	const opts = { ...options }
	if (opts.skipRows && opts.readRows) {
		opts.readRows += opts.skipRows
	}
	const mappedOptions = mapProps(ParserType.PapaParse, opts) as ParseConfig
	const table = papa.parse(text, mappedOptions)
	if (opts.skipRows) {
		const subset = skipRows(table.data, opts.skipRows)
		table.data = subset
	}
	return from(table.data)
}

export function hasArqueroOptions(options: ParserOptions): boolean {
	const props = Object.keys(options)
	return props.every(p => ARQUERO_SUPPORTED_OPTS.has(p))
}

export function mapProps(
	type: ParserType,
	options?: ParserOptions,
): CSVParseOptions | ParseConfig {
	switch (type) {
		case ParserType.PapaParse:
			return {
				header: true,
				...mapToPapaParseOptions(options),
			}
		case ParserType.Arquero:
		default:
			return {
				autoType: false,
				...mapToArqueroOptions(options),
			}
	}
}

function mapOptions(
	map: Record<string, string>,
): (options?: ParserOptions) => Record<string, any> {
	return function (options?: ParserOptions) {
		if (!options) {
			return {}
		}
		return Object.keys(options).reduce(
			(acc: Record<string, any>, curr: string) => {
				const key = map[curr] || curr
				return {
					...acc,
					[key]: (options as any)[curr],
				}
			},
			{},
		)
	}
}

export function mapToArqueroOptions(options?: ParserOptions): CSVParseOptions {
	const mapper = mapOptions(ARQUERO_PROPS_MAP)
	return mapper(options)
}

export function mapToPapaParseOptions(options?: ParserOptions): ParseConfig {
	const mapper = mapOptions(PAPAPARSE_PROPS_MAP)
	return mapper(options)
}

export function hasOneChar(value: string): boolean {
	return value.length === 1
}

export function lineTerminatorIsValid(value: string): boolean {
	return LINE_TERMINATORS.has(value)
}

export function allUnique(values: string[]): boolean {
	const unique = uniq(values)
	return unique.length === values.length
}

export function validOptions(options?: ParserOptions): boolean {
	if (!options) {
		return true
	}
	const props = Object.keys(options)
	return props.every((prop: string) =>
		(validators as any)[prop]
			? (options as any)[prop] != undefined
				? (validators as any)[prop]((options as any)[prop])
				: true
			: true,
	)
}

const validators = {
	delimiter: hasOneChar,
	names: allUnique,
	quoteChar: hasOneChar,
	escapeChar: hasOneChar,
	comment: hasOneChar,
	lineTerminator: lineTerminatorIsValid,
}

export function skipRows(data: any[], skipRows: number): any[] {
	return data.slice(skipRows)
}
