/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ParserOptions } from '@datashaper/schema'
import {
	arqueroSupportedOptions,
	arqueroPropMap,
	papaParsePropsMap,
	lineTerminators,
} from './readTable.defaults.js'
import { fromCSV, from } from 'arquero'
import { default as papa, type ParseConfig } from 'papaparse'
import { uniq } from 'lodash-es'
import { ParserType } from './readTable.types.js'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { CSVParseOptions } from 'arquero/dist/types/format/from-csv'

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
	let table = fromCSV(text, mappedOptions)
	return options.readRows ? from(table.slice(0, options.readRows)) : table
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
	return props.every(p => arqueroSupportedOptions.has(p))
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
	const mapper = mapOptions(arqueroPropMap)
	return mapper(options)
}

export function mapToPapaParseOptions(options?: ParserOptions): ParseConfig {
	const mapper = mapOptions(papaParsePropsMap)
	return mapper(options)
}

export function hasOneChar(value: string): boolean {
	return value.length === 1
}

export function lineTerminatorIsValid(value: string): boolean {
	return lineTerminators.has(value)
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
			? (validators as any)[prop]((options as any)[prop])
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
