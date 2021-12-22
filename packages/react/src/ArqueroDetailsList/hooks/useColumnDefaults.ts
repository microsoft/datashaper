/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableMetadata, introspect } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import { createRenderDefaultCell, createRenderSmartCell } from '../renderers'

const DEFAULT_COLUMN_WIDTH = 80

/**
 * Establish reasonable column defaults if none have been provided
 * @param table
 * @param autoRender - indicates whether we should use introspection to perform smart rendering
 * @param columns - column configs to use either as the entire config or as a subset of configured with remaining to receive defaults
 * @param includeAll - indicates whether to ensure every Arquero column has a DetailsList column, filling in defaults where `columns` does not provide a config.
 * @returns
 */
export function useColumnDefaults(
	table: ColumnTable,
	autoRender = false,
	columns?: IColumn[],
	includeAll = false,
): IColumn[] {
	const meta: TableMetadata = useMemo(
		() => introspect(table, autoRender),
		[table, autoRender],
	)

	const colorScale = useIncrementingColorScale(meta)

	return useMemo(() => {
		if (columns && !includeAll) {
			return columns
		}
		const columnMap = reduce(columns)
		const names = table.columnNames()

		return names.map(name => {
			const m = meta.columns[name]
			const color = m.type === 'number' ? colorScale() : undefined
			const onRender = autoRender
				? createRenderSmartCell(m, color)
				: createRenderDefaultCell(m)
			return (
				columnMap[name] || {
					key: name,
					name,
					minWidth: DEFAULT_COLUMN_WIDTH,
					fieldName: name,
					onRender,
				}
			)
		})
	}, [table, autoRender, meta, columns, colorScale, includeAll])
}

function useIncrementingColorScale(meta: TableMetadata) {
	const theme = useThematic()
	const count = useMemo(() => countNumeric(meta), [meta])
	const scale = useMemo(() => theme.scales().nominal(count), [theme, count])
	return useMemo(() => {
		let index = 0
		return () => scale(index++).hex()
	}, [scale])
}

function countNumeric(meta: TableMetadata): number {
	return Object.values(meta.columns).reduce((acc, cur) => {
		return acc + (cur.type === 'number' ? 1 : 0)
	}, 0)
}

function reduce(columns?: IColumn[]): Record<string, IColumn> {
	return (columns || []).reduce((acc, cur) => {
		acc[cur.name] = cur
		return acc
	}, {} as Record<string, IColumn>)
}
