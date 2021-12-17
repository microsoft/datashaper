/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import type { internal as ArqueroTypes } from 'arquero'
import { useMemo } from 'react'
import { renderDefaultCell } from '../renderers'

const DEFAULT_COLUMN_WIDTH = 80

/**
 * Establish reasonable column defaults if none have been provided
 * @param table
 * @param columns - column configs to use either as the entire config or as a subset of configured with remaining to receive defaults
 * @param includeAll - indicates whether to ensure every Arquero column has a DetailsList column, filling in defaults where `columns` does not provide a config.
 * @returns
 */
export function useColumnDefaults(
	table: ArqueroTypes.ColumnTable,
	columns?: IColumn[],
	includeAll = false,
): IColumn[] {
	return useMemo(() => {
		if (columns && !includeAll) {
			return columns
		}
		const columnMap = reduce(columns)
		const names = table.columnNames()
		return names.map(name => {
			return (
				columnMap[name] || {
					key: name,
					name,
					minWidth: DEFAULT_COLUMN_WIDTH,
					fieldName: name,
					onRender: renderDefaultCell,
				}
			)
		})
	}, [table, columns, includeAll])
}

function reduce(columns?: IColumn[]): Record<string, IColumn> {
	return (columns || []).reduce((acc, cur) => {
		acc[cur.name] = cur
		return acc
	}, {} as Record<string, IColumn>)
}
