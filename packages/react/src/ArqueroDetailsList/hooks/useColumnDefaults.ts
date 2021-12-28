/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableMetadata, introspect } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import {
	createRenderDefaultCell,
	createRenderDefaultColumnHeader,
	createRenderHistogramColumnHeader,
	createRenderSmartCell,
} from '../renderers'
import { useIncrementingColumnColorScale } from '.'

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
	onColumnClick?: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void,
	includeAll = false,
	isSortable = false,
): IColumn[] {
	const meta: TableMetadata = useMemo(
		() => introspect(table, autoRender),
		[table, autoRender],
	)

	const colorScale = useIncrementingColumnColorScale(meta)

	const styles = useStyles(onColumnClick, isSortable)

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
				? createRenderSmartCell(m, color, onColumnClick)
				: createRenderDefaultCell(m, onColumnClick)
			// HACK: if we let an iconName through, the rendering messes with our layout
			// in order to control this we'll pass the original props to the generators,
			// but omit from what gets sent to the top-level table
			// as far as I can tell there's no other way to force the table to let us control this icon rendering
			// without completely recreating the details header render
			const original = (columnMap[name] || {}) as Partial<IColumn>
			const { iconName, ...defaults } = original
			const onRenderHeader = autoRender
				? createRenderHistogramColumnHeader(original, m, color)
				: createRenderDefaultColumnHeader(original)
			return {
				key: name,
				name,
				minWidth: DEFAULT_COLUMN_WIDTH,
				fieldName: name,
				onRender,
				onRenderHeader,
				styles: styles,
				...defaults,
			}
		})
	}, [table, autoRender, meta, columns, colorScale, onColumnClick, includeAll])
}

function useStyles(onColumnClick, isSortable) {
	return useMemo(
		() => ({
			// we add our own sort icon in the DefaultColumnHeader component
			// this is because the onRenderHeader column function only
			// affects an inner div, which can be compressed when sorting is present
			// we therefore render it ourselves so we can control the layout completely.
			sortIcon: {
				display: 'none',
			},
			root: {
				cursor: onColumnClick || isSortable ? 'pointer' : 'default',
			},
		}),
		[onColumnClick, isSortable],
	)
}

function reduce(columns?: IColumn[]): Record<string, IColumn> {
	return (columns || []).reduce((acc, cur) => {
		acc[cur.name] = cur
		return acc
	}, {} as Record<string, IColumn>)
}
