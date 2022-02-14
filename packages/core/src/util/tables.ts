/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import {
	Bin,
	Category,
	ColumnMetadata,
	ColumnStats,
	DataType,
	TableMetadata,
} from '../index.js'
import { fixedBinCount } from '../engine/util/index.js'
import { columnType, determineType } from './index.js'

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
	// Force to get stats from ungrouped table, otherwise will get stats with grouped information and graph will not show
	const s = stats(table.ungroup())
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
	// Force to get stats from ungrouped table, otherwise will get stats with grouped information and graph will not show
	const t = types(table.ungroup())
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
	const reqStats = requiredStats(table)
	const optStats = optionalStats(table)
	const bins = binning(table, reqStats, optStats)
	const cats = categories(table, reqStats)
	const results = table.columnNames().reduce((acc, cur) => {
		// mode should only include valid values, so a reasonable value for checking type
		const mode = reqStats[`${cur}.mode`]
		const type = determineType(mode)
		const req = {
			type,
			count: reqStats[`${cur}.count`],
			distinct: reqStats[`${cur}.distinct`],
			invalid: reqStats[`${cur}.invalid`],
			mode,
		}
		const optn =
			type === DataType.Number
				? {
						min: optStats[`${cur}.min`],
						max: optStats[`${cur}.max`],
						mean: optStats[`${cur}.mean`],
						median: optStats[`${cur}.median`],
						stdev: optStats[`${cur}.stdev`],
						bins: bins[`${cur}.bins`],
				  }
				: {}
		const optt =
			type === DataType.Text
				? {}
				: {
						categories: cats[`${cur}`],
				  }
		acc[cur] = {
			...req,
			...optn,
			...optt,
		}
		return acc
	}, {} as Record<string, ColumnStats>)
	return results
}

function requiredStats(table: ColumnTable): Record<string, any> {
	const args = table.columnNames().reduce((acc, cur) => {
		acc[`${cur}.count`] = op.count()
		acc[`${cur}.distinct`] = op.distinct(cur)
		acc[`${cur}.invalid`] = op.invalid(cur)
		acc[`${cur}.mode`] = op.mode(cur)
		return acc
	}, {} as Record<string, any>)
	return table.rollup(args).objects()[0]
}

function optionalStats(table: ColumnTable): Record<string, any> {
	const args = table.columnNames().reduce((acc, cur) => {
		acc[`${cur}.min`] = op.min(cur)
		acc[`${cur}.max`] = op.max(cur)
		acc[`${cur}.mean`] = op.mean(cur)
		acc[`${cur}.median`] = op.median(cur)
		acc[`${cur}.stdev`] = op.stdev(cur)
		return acc
	}, {} as Record<string, any>)
	return table.rollup(args).objects()[0]
}

function binning(
	table: ColumnTable,
	reqStats: Record<string, any>,
	optStats: Record<string, any>,
) {
	const numeric = table.columnNames(name => {
		const mode = reqStats[`${name}.mode`]
		const type = determineType(mode)
		return type === DataType.Number
	})
	const binArgs = numeric.reduce((acc, cur) => {
		const min = optStats[`${cur}.min`]
		const max = optStats[`${cur}.max`]
		const distinct = reqStats[`${cur}.distinct`]
		acc[cur] = fixedBinCount(cur, min, max, 10, true, distinct)
		return acc
	}, {} as Record<string, any>)

	const binRollup = table.select(numeric).derive(binArgs)

	// for each binned column, derive a sorted & counted subtable.
	// note that only bins with at least one entry will have a row,
	// so we could have less than 10 bins - hence the fill
	const counted = numeric.reduce((acc, cur) => {
		const min = optStats[`${cur}.min`]
		const max = optStats[`${cur}.max`]
		const distinct = reqStats[`${cur}.distinct`]
		const bins = binRollup
			.groupby(cur)
			.count()
			.objects()
			.sort((a, b) => a[cur] - b[cur])
			.map(d => ({
				min: d[cur],
				count: d.count,
			}))
		// numeric sort puts null at the front - format to match categories style if present
		if (bins[0].min === null) {
			bins[0].min = '(empty)'
		}
		// make sure we actually have 10
		acc[`${cur}.bins`] = fillBins(bins, min, max, 10, distinct)
		return acc
	}, {} as Record<string, Bin[]>)

	return counted
}

function fillBins(
	bins: Bin[],
	min: number,
	max: number,
	count: number,
	distinct: number,
): Bin[] {
	if (distinct <= count) {
		return bins
	}
	const step = (max - min) / count
	const hash = bins.reduce((acc, cur) => {
		acc[cur.min] = cur
		return acc
	}, {} as Record<string, Bin>)
	const mins = new Array(10).fill(step).map((v, i) => v * i + min)
	const filled = mins.map(
		v =>
			hash[v] || {
				min: v,
				count: 0,
			},
	)
	if (bins[0].min === '(empty)') {
		filled.unshift(bins[0])
	}
	return filled
}

function categories(
	table: ColumnTable,
	reqStats: Record<string, any>,
	limit = 20,
) {
	// note we're going to limit it this to columns with a small number of unique values.
	// it just doesn't make sense to count everything that is distinct if we can't plot/display it
	const text = table.columnNames(name => {
		const mode = reqStats[`${name}.mode`]
		const distinct = reqStats[`${name}.distinct`]
		const type = determineType(mode)
		return type === DataType.String && distinct <= limit
	})
	return text.reduce((acc, cur) => {
		const counted = table
			// insert empty text for strings upfront, otherwise localeCompare will fail
			.impute({ [cur]: () => '(empty)' })
			.groupby(cur)
			.count()
			.objects()
			.sort((a, b) => `${a[cur]}`.localeCompare(`${b[cur]}`))
			.map(d => ({ name: d[cur], count: d.count }))
		acc[cur] = counted
		return acc
	}, {} as Record<string, Category[]>)
}

// TODO: arquero does autotyping on load, is this meta stored internally?
// https://uwdata.github.io/arquero/api/#fromCSV
// TODO: this doesn't recognize dates if arquero didn't parse them
/**
 * Generates column typings info for a table.
 * @param table
 * @returns
 */
export function types(table: ColumnTable): Record<string, DataType> {
	const sampled = table.sample(SAMPLE_MAX)
	return sampled.columnNames().reduce((acc, cur) => {
		acc[cur] = columnType(table, cur)
		return acc
	}, {} as Record<string, DataType>)
}
