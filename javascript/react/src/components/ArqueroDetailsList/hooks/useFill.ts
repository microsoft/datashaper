/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import { useSize } from 'ahooks'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useMemo } from 'react'

import {
	BASE_HEADER_HEIGHT,
	DEFAULT_COLUMN_WIDTH,
	DEFAULT_ROW_HEIGHT,
	HEADER_WIDTH_PADDING,
	HISTOGRAM_HEADER_HEIGHT,
	STATS_HEADER_ITEM_HEIGHT,
} from '../ArqueroDetailsList.constants.js'
import type { ArqueroDetailsListFeatures } from '../ArqueroDetailsList.types.js'

export function useFill(
	table: ColumnTable,
	columns: IColumn[] | undefined,
	ref: any,
	fill: boolean,
	features: ArqueroDetailsListFeatures,
	options: {
		compact: boolean
		compactRowHeight: number
	},
): {
	virtualColumns: IColumn[]
	virtualRows: any[]
} {
	const size = useSize(ref)
	const virtualColumns = useVirtualColumns(table, columns, fill, size)
	const virtualRows = useVirtualRows(
		table,
		columns,
		fill,
		features,
		options,
		size,
	)

	return {
		virtualColumns,
		virtualRows,
	}
}

function useVirtualRows(
	table: ColumnTable,
	columns: IColumn[] | undefined,
	fill: boolean,
	features: ArqueroDetailsListFeatures,
	options: { compact: boolean; compactRowHeight: number },
	size: { width: number; height: number } | undefined,
) {
	const virtualRows = useMemo(() => {
		const headerHeight = computeHeaderHeight(features)
		const rowHeight =
			table.numRows() *
			(options.compact ? options.compactRowHeight : DEFAULT_ROW_HEIGHT)
		const totalHeight = headerHeight + rowHeight
		if (size && fill) {
			const remainder = size.height - totalHeight
			const per = options.compact
				? options.compactRowHeight
				: DEFAULT_ROW_HEIGHT
			const count = Math.ceil(remainder / per)
			const keys = columns ? columns.map((c) => c.key) : table.columnNames()
			const template = keys.reduce((acc, cur) => {
				// empty prop value for normal columns will result in a BlankCell render
				acc[cur] = ' '
				return acc
			}, {} as any)
			if (count > 0) {
				return new Array(count).fill(template)
			}
		}
		return []
	}, [table, columns, fill, features, options, size])

	return virtualRows
}

function useVirtualColumns(
	table: ColumnTable,
	columns: IColumn[] | undefined,
	fill: boolean,
	size: { width: number; height: number } | undefined,
) {
	const virtualColumns = useMemo(() => {
		if (fill && size) {
			const totalCount = columns?.length || table.numCols()
			const totalMinWidth = columns
				? columns.reduce((acc, cur) => acc + cur.minWidth, 0)
				: table.columnNames().length * DEFAULT_COLUMN_WIDTH
			// TODO: this 20 is hard-coded padding in cellTitle
			const totalFullWidth = totalMinWidth + totalCount * HEADER_WIDTH_PADDING
			const averageMinWidth = totalMinWidth / totalCount
			const fillWidth = size.width - totalFullWidth
			const count = Math.ceil(
				fillWidth / (averageMinWidth + HEADER_WIDTH_PADDING),
			)
			const template = {
				fieldName: '',
				data: {
					virtual: true,
				},
			}
			if (count > 0) {
				let remaining = fillWidth
				const cols = new Array(count).fill(template).map((a, i) => {
					remaining -= averageMinWidth + HEADER_WIDTH_PADDING
					return {
						key: `---virtual-${i}---`,
						name: `---virtual-${i}---`,
						// precisely fill the width by trimming the last column
						minWidth:
							remaining < 0 ? averageMinWidth + remaining : averageMinWidth,
						...a,
					}
				}) as IColumn[]
				return cols
			}
		}
		return []
	}, [table, columns, fill, size])

	return virtualColumns
}

function computeHeaderHeight(features: ArqueroDetailsListFeatures) {
	let base = BASE_HEADER_HEIGHT
	if (features.smartHeaders || features.statsColumnHeaders) {
		const cellHeight = STATS_HEADER_ITEM_HEIGHT
		const length = features.statsColumnTypes?.length || 5
		base += cellHeight * length
	}
	if (features.smartHeaders || features.histogramColumnHeaders) {
		base += HISTOGRAM_HEADER_HEIGHT
	}
	return base
}
