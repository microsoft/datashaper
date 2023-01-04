/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ParserOptions } from '@datashaper/schema'
import { from, fromCSV } from 'arquero'
import type { CSVParseOptions } from 'arquero/dist/types/format/from-csv'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { uniq } from 'lodash-es'
import { type ParseConfig, default as papa } from 'papaparse'

import {
	ARQUERO_PROPS_MAP,
	ARQUERO_SUPPORTED_OPTS,
	LINE_TERMINATORS,
	PAPAPARSE_PROPS_MAP,
} from './readCsvTable.constants.js'
import { ParserType } from './readCsvTable.types.js'
import { fromJSONValues } from './readJSONTable.js'

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

function arqueroParser(
	text: string,
	options: ParserOptions = {},
	autoType = true,
): ColumnTable {
	const mappedOptions = mapToArqueroOptions(options, autoType)
	const table = fromCSV(text, mappedOptions)
	return options.readRows ? table.slice(0, options.readRows) : table
}

function papaParser(
	text: string,
	options: ParserOptions = {},
	autoType = true,
): ColumnTable {
	const opts = { ...options }
	if (opts.skipRows && opts.readRows) {
		opts.readRows += opts.skipRows
	}
	const mappedOptions = mapToPapaParseOptions(opts, autoType) as ParseConfig
	const table = papa.parse(text, mappedOptions)
	if (opts.skipRows) {
		const subset = skipRows(table.data, opts.skipRows)
		table.data = subset
	}
	// if there are no table headers, papaparse returns array of arrays
	// we'll add some headers and then use our default values parser
	if (!options.header) {
		let names = options.names
		if (!names) {
			// generate names in the style of arquero
			// TODO: how does this align with pandas default names?
			names = table.data[0].map((_: any, i: number) => `col${i + 1}`)
		}
		table.data.unshift(names)
		return fromJSONValues(table.data)
	}

	return from(table.data)
}

export function hasArqueroOptions(options: ParserOptions): boolean {
	const props = Object.keys(options)
	return props.every(p => ARQUERO_SUPPORTED_OPTS.has(p))
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

export function mapToArqueroOptions(
	options?: ParserOptions,
	autoType = true,
): CSVParseOptions {
	const mapper = mapOptions(ARQUERO_PROPS_MAP)
	return {
		...mapper(options),
		autoType,
	}
}

export function mapToPapaParseOptions(
	options?: ParserOptions,
	autoType = true,
): ParseConfig {
	const mapper = mapOptions(PAPAPARSE_PROPS_MAP)
	return {
		header: true,
		dynamicTyping: autoType,
		...mapper(options),
	}
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
