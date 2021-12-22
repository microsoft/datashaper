/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { isDate, isArray } from 'lodash'
import { ColumnMetadata, ColumnStats, TableMetadata } from '..'

// arquero uses 1000 as default, but we're sampling the table so assuming higher odds of valid values
const SAMPLE_MAX = 100

/**
 * Performs type inference and stats on a table/columns.
 * @param table
 * @param detailed - include detailed per-column stats, otherwise just basic types
 * @returns
 */
export function introspect(
	table: ColumnTable,
	detailed = false,
): TableMetadata {
	const columns = detailed ? detailedMeta(table) : basicMeta(table)
	return {
		rows: table.numRows(),
		cols: table.numCols(),
		columns,
	}
}

function detailedMeta(table: ColumnTable): Record<string, ColumnMetadata> {
	const s = stats(table)
	return table.columnNames().reduce((acc, cur) => {
		acc[cur] = {
			name: cur,
			type: s[cur].type,
			stats: s[cur],
		}
		return acc
	}, {} as Record<string, ColumnMetadata>)
}

function basicMeta(table: ColumnTable): Record<string, ColumnMetadata> {
	const t = types(table)
	return table.columnNames().reduce((acc, cur) => {
		acc[cur] = {
			name: cur,
			type: t[cur],
		}
		return acc
	}, {} as Record<string, ColumnMetadata>)
}

/**
 * Generates detailed column stats for a table.
 * @param table
 * @returns
 */
export function stats(table: ColumnTable): Record<string, ColumnStats> {
	const rArgs = table.columnNames().reduce((acc, cur) => {
		acc[`${cur}.count`] = op.count()
		acc[`${cur}.distinct`] = op.distinct(cur)
		acc[`${cur}.invalid`] = op.invalid(cur)
		acc[`${cur}.min`] = op.min(cur)
		acc[`${cur}.max`] = op.max(cur)
		acc[`${cur}.mean`] = op.mean(cur)
		acc[`${cur}.median`] = op.median(cur)
		acc[`${cur}.mode`] = op.mode(cur)
		acc[`${cur}.stdev`] = op.stdev(cur)
		return acc
	}, {} as Record<string, any>)
	const rollup = table.rollup(rArgs).objects()[0]
	return table.columnNames().reduce((acc, cur) => {
		// mode should only include valid values, so a reasonable value for checking type
		const mode = rollup[`${cur}.mode`]
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
		const type = determineType(mode)
		const req = {
			type,
			count: rollup[`${cur}.count`],
			distinct: rollup[`${cur}.distinct`],
			invalid: rollup[`${cur}.invalid`],
			mode,
		}
		const opt =
			type === 'number'
				? {
						min: rollup[`${cur}.min`],
						max: rollup[`${cur}.max`],
						mean: rollup[`${cur}.mean`],
						median: rollup[`${cur}.median`],
						stdev: rollup[`${cur}.stdev`],
				  }
				: {}
		acc[cur] = {
			...req,
			...opt,
		}
		return acc
	}, {} as Record<string, ColumnStats>)
}

// TODO: arquero does autotyping on load, is this meta stored internally?
// https://uwdata.github.io/arquero/api/#fromCSV
// TODO: this doesn't recognize dates if arquero didn't parse them
/**
 * Generates column typings info for a table.
 * @param table
 * @returns
 */
export function types(table: ColumnTable): Record<string, string> {
	const sampled = table.sample(SAMPLE_MAX)
	return sampled.columnNames().reduce((acc, cur) => {
		const values = table.array(cur)
		// use the first valid value to guess type
		values.some((value, index) => {
			if (value !== null && value !== undefined) {
				acc[cur] = determineType(value)
				return true
			}
			return false
		})
		return acc
	}, {} as Record<string, string>)
}

function determineType(value: any): string {
	let type = typeof value as string
	if (type === 'object') {
		if (isDate(value)) {
			type = 'date'
		} else if (isArray(value)) {
			type = 'array'
		}
	}
	return type
}
