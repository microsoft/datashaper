/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableMetadata, introspect } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
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

	return useMemo(() => {
		if (columns && !includeAll) {
			return columns
		}
		const columnMap = reduce(columns)
		const names = table.columnNames()
		return names.map(name => {
			const m = meta.columns[name]
			const onRender = autoRender
				? createRenderSmartCell(m)
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
	}, [table, autoRender, meta, columns, includeAll])
}

function reduce(columns?: IColumn[]): Record<string, IColumn> {
	return (columns || []).reduce((acc, cur) => {
		acc[cur.name] = cur
		return acc
	}, {} as Record<string, IColumn>)
}
