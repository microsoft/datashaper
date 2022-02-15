/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import { from } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import type { GroupedTable } from '../../index.js'
import { useTableButtons } from './TableButtons.js'

export function useGroupedTable(tables: GroupedTable[]): ColumnTable {
	return useMemo(() => {
		return !tables.length
			? from(tables)
			: from(tables).groupby('group').orderby('group')
	}, [tables])
}

export function useIsTableSelected(
	selected?: string,
): (tableName: string) => boolean {
	return useCallback(
		(tableName: string) => {
			return selected === tableName
		},
		[selected],
	)
}

export function useColumns(onSelect?: (name: string) => void): IColumn[] {
	const renderTableButtons = useTableButtons()

	//The group column is needed to present the grouping (input or intermediary) but doesn't need
	//to show in the list, so we use the same column for the buttons
	const cmd = useMemo((): IColumn[] => {
		return [
			{
				name: 'name',
				fieldName: 'name',
				key: 'name',
			},
			{
				name: 'group',
				fieldName: 'group',
				key: 'group',
				maxWidth: 60,
				onRender: item => renderTableButtons(item, onSelect),
			},
		] as IColumn[]
	}, [onSelect, renderTableButtons])

	return cmd
}
