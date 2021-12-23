/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableMetadata } from '@data-wrangling-components/core'
import { bin } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import { Bin } from '../renderers/types'

/**
 * For each numeric column in a table, return an array of bins
 * @param table
 * @param meta
 * @param autoRender
 * @returns
 */
// TODO: maybe just bake all this into the core stats compute?
export function useColumnBins(
	table: ColumnTable,
	meta: TableMetadata,
	autoRender = false,
): Record<string, Bin[]> {
	return useMemo(() => {
		if (!autoRender) {
			return {}
		}

		const args = Object.entries(meta.columns).reduce((acc, cur) => {
			const [name, obj] = cur
			if (obj.type === 'number') {
				acc[name] = bin(name, { maxbins: 10 })
			}
			return acc
		}, {} as Record<string, any>)

		const binned = table.derive(args)

		// for each binned column, derive a sorted & counted subtable
		const counted = Object.keys(args).reduce((acc, cur) => {
			const bins = binned
				.orderby(cur)
				.groupby(cur)
				.count()
				.objects()
				.sort((a, b) => a[cur] - b[cur])
				.map(d => ({
					min: d[cur],
					count: d.count,
				}))

			acc[cur] = bins

			return acc
		}, {} as Record<string, Bin[]>)

		return counted
	}, [table, meta, autoRender])
}
