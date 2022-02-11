/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { from } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import { GroupedTable } from '../../'
import { usePreviewTableButton } from './PreviewTableButton'

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
	const renderPreviewTableButton = usePreviewTableButton()

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
				onRender: item => renderPreviewTableButton(item, onSelect),
			},
		] as IColumn[]
	}, [onSelect, renderPreviewTableButton])

	return cmd
}
