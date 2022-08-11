/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createDefaultHeaderCommandBar } from '@datashaper/react'
import { downloadCommand, visibleColumnsCommand } from '@datashaper/react'
import type { IColumn } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { ColumnConfigMap } from './Table.types.js'

export function useCommandBar(
	table: ColumnTable,
	visibleColumns: string[],
	updateColumns: SetterOrUpdater<string[]>,
): JSX.Element {
	const theme = useThematic()

	const handleColumnCheckChange = useCallback(
		(column: string, checked: boolean) => {
			updateColumns(previous => {
				if (checked) {
					// order doesn't matter here
					return [...(previous || []), column]
				} else {
					return [...(previous || [])].filter(col => col !== column)
				}
			})
		},
		[updateColumns],
	)

	const items = useMemo(
		() => [
			visibleColumnsCommand(table, visibleColumns, handleColumnCheckChange),
		],
		[table, visibleColumns, handleColumnCheckChange],
	)

	return useMemo(
		() => createDefaultHeaderCommandBar({ items }, theme),
		[items, theme],
	)
}

export function useFarCommandBar(table: ColumnTable): JSX.Element {
	const theme = useThematic()
	const items = useMemo(() => [downloadCommand(table)], [table])
	return useMemo(
		() => createDefaultHeaderCommandBar({ items }, theme, true),
		[items, theme],
	)
}

export function useColumns(config: ColumnConfigMap): IColumn[] {
	return useMemo(() => {
		return Object.entries(config).map(([key, conf]) => ({
			key,
			name: key,
			fieldName: key,
			minWidth: conf.width,
			iconName: conf.iconName,
		})) as IColumn[]
	}, [config])
}
