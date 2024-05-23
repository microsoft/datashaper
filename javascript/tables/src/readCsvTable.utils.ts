/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ParserOptions } from '@datashaper/schema'
import { escape, from, fromCSV } from 'arquero'
import type { CSVParseOptions } from 'arquero/dist/types/format/from-csv'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { uniq } from 'lodash-es'
import { type ParseConfig, default as papa } from 'papaparse'

import {
	ARQUERO_INTERNAL_DEFAULTS,
	ARQUERO_SUPPORTED_OPTS,
	LINE_TERMINATORS,
	PAPAPARSE_PROPS_MAP,
} from './readCsvTable.constants.js'
import { ParserType } from './readCsvTable.types.js'
import { fromJSONValues } from './readJSONTable.js'

export function determineParserType(options?: ParserOptions): ParserType {
	if (!options || hasArqueroOptions(options)) {
		return ParserType.Arquero
	} else {
		return ParserType.PapaParse
	}
}

export function getParser(
	options?: ParserOptions,
): (text: string, options?: ParserOptions) => ColumnTable {
	const type = determineParserType(options)
	switch (type) {
		case ParserType.PapaParse:
			return papaParser
		case ParserType.Arquero:
			return arqueroParser
	}
}

function arqueroParser(text: string, options: ParserOptions = {}): ColumnTable {
	const mappedOptions = mapToArqueroOptions(options)
	const table = fromCSV(text, mappedOptions)
	// arquero no longer skips blank lines by default, but that's the pandas standard
	// filtering them here allows to still default to arquero for simple use cases, since papaparse is slower
	const cleaned = options.skipBlankLines
		? table.filter(
				escape(
					(r: any) =>
						!Object.values(r).every((v) => v === null || v === undefined),
				),
			)
		: table
	const skip = options.skipRows || 0
	const read = (options.readRows || Infinity) + skip
	return cleaned.slice(skip, read)
}

function papaParser(text: string, options: ParserOptions = {}): ColumnTable {
	const opts = { ...options }
	if (opts.skipRows && opts.readRows) {
		opts.readRows += opts.skipRows
	}
	const mappedOptions = mapToPapaParseOptions(opts) as ParseConfig
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
	// use a two-step process to check for arquero validity.
	// we want to use arquero as much as possible because it is very fast.
	// 1 - check if any options match values that arquero supports internally but are not configurable
	// (e.g., lineTerminator in arquero defaults to \n)
	// 2 - of the remaining options, confirm that they are all configurable in arquero
	// filter out any props with no actual value
	const props = Object.entries(options)
		.filter(([_, v]) => v !== undefined)
		.map(([k]) => k)
	const internalDefaults = props.filter(
		(p) =>
			ARQUERO_INTERNAL_DEFAULTS.has(p) &&
			options[p as keyof ParserOptions] === ARQUERO_INTERNAL_DEFAULTS.get(p),
	)
	const configurable = props.filter((p) => ARQUERO_SUPPORTED_OPTS.has(p))
	const supportedSet = new Set([...internalDefaults, ...configurable])
	const remaining = props.filter((p) => !supportedSet.has(p))
	return remaining.length === 0
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
	return {
		autoType: false,
		...options,
	}
}

export function mapToPapaParseOptions(options?: ParserOptions): ParseConfig {
	const mapper = mapOptions(PAPAPARSE_PROPS_MAP)
	return {
		header: true,
		dynamicTyping: false,
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
			? (options as any)[prop] !== undefined
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

function skipRows(data: any[], skipRows: number): any[] {
	return data.slice(skipRows)
}
