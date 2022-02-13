/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
import { from } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import { GroupedTable, TableGroup } from '../../'
import { useTableButtons } from './TableButtons'

export function useGroupedTable(tables: GroupedTable[]): ColumnTable {
	return useMemo(() => {
		return !tables.length
			? from(tables)
			: from(tables).groupby('group').orderby('group')
	}, [tables])
}

export function useCanDelete(steps?: Step[]): (item: any) => boolean {
	return useCallback(
		(item: any) => {
			const hasArgs = steps?.length
				? steps?.find(s => {
						if (s.args) {
							const args = s.args as Record<string, unknown>
							//TODO: are there any type problems on this?
							return Object.keys(args).find(x => {
								return args[x] === item.name
							})
						}
						return false
				  })
				: false

			return !steps?.find(s => s.input === item.name) && !hasArgs
		},
		[steps],
	)
}

export function useHasDelete(): (item: any) => boolean {
	return useCallback(
		(item: any): boolean => item.group === TableGroup.Input,
		[],
	)
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

export function useColumns(
	onSelect?: (name: string) => void,
	onDelete?: (name: string) => void,
	steps?: Step[],
): IColumn[] {
	const renderTableButtons = useTableButtons(steps)

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
				onRender: item => renderTableButtons(item, onSelect, onDelete),
			},
		] as IColumn[]
	}, [onSelect, renderTableButtons, onDelete])

	return cmd
}
