/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Bin, Category, ColumnStats } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { fixedBinCount } from './binning.js'
import { determineType } from './data.js'

/**
 * Generates detailed column stats for a table.
 * @param table -
 * @returns
 */
export function stats(
	table: ColumnTable,
	columns?: string[],
): Record<string, ColumnStats> {
	const selected = columns ? table.select(columns) : table
	const reqStats = requiredStats(selected)
	const optStats = optionalStats(selected, reqStats)
	const bins = binning(selected, reqStats, optStats)
	const cats = categories(selected, reqStats)
	const results = selected.columnNames().reduce((acc, cur) => {
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
	return table.rollup(args).objects()[0]!
}

function optionalStats(
	table: ColumnTable,
	reqStats: Record<string, any>,
): Record<string, any> {
	const args = table.columnNames().reduce((acc, cur) => {
		const mode = reqStats[`${cur}.mode`]
		const type = determineType(mode)
		if (type === DataType.Number || type === DataType.Date) {
			acc[`${cur}.min`] = op.min(cur)
			acc[`${cur}.max`] = op.max(cur)
			acc[`${cur}.mean`] = op.mean(cur)
			acc[`${cur}.median`] = op.median(cur)
			acc[`${cur}.stdev`] = op.stdev(cur)
		}
		return acc
	}, {} as Record<string, any>)
	return table.rollup(args).objects()[0]!
}

function binning(
	table: ColumnTable,
	reqStats: Record<string, any>,
	optStats: Record<string, any>,
	columns?: string[],
) {
	const filter = filterColumns(columns, name => {
		const mode = reqStats[`${name}.mode`]
		const type = determineType(mode)
		return type === DataType.Number
	})
	const numeric = table.columnNames(filter)
	const binArgs = numeric.reduce((acc, cur) => {
		const min = optStats[`${cur}.min`]
		const max = optStats[`${cur}.max`]
		const distinct = reqStats[`${cur}.distinct`]
		if (distinct > 10) {
			acc[cur] = fixedBinCount(cur, min, max, 10, true)
		}
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
			.orderby(cur)
			.objects()
			.map(d => ({
				min: d[cur],
				count: d['count'],
			}))
		// numeric sort puts null at the front - format to match categories style if present
		if (bins[0]!.min === null) {
			bins[0]!.min = '(empty)'
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
	if (bins[0]!.min === '(empty)') {
		filled.unshift(bins[0]!)
	}
	return filled
}

function categories(
	table: ColumnTable,
	reqStats: Record<string, any>,
	limit = 20,
) {
	// note we're going to limit this to columns with a small number of unique values.
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
			// sorting manually here so strings are alpha ignoring case
			.sort((a, b) => `${a[cur]}`.localeCompare(`${b[cur]}`))
			.map(d => ({ name: d[cur], count: d['count'] }))
		acc[cur] = counted
		return acc
	}, {} as Record<string, Category[]>)
}

type FilterFunction = (name: string, index: number, array: string[]) => boolean

// creates a curried filter function for column names
// applies the column check first, and only invokes secondary filter function if that passes
function filterColumns(
	columns?: string[],
	filter?: FilterFunction,
): FilterFunction {
	const set = new Set(columns)
	const filt = filter || (() => true)
	return (name, index, array) => {
		if (columns) {
			return set.has(name) && filt(name, index, array)
		}
		return filt(name, index, array)
	}
}
