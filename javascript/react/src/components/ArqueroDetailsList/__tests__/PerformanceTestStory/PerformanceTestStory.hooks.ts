/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/arquero'
import { introspect } from '@datashaper/arquero'
import type { ICommandBarItemProps, IDetailsColumnProps } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { Struct } from 'arquero/dist/types/table/transformable'
import type { SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'

import {
	createDefaultCommandBar,
	createDefaultHeaderCommandBar,
} from '../component-factories.js'

export function useColumnCommands(): (
	props?: IDetailsColumnProps,
) => JSX.Element {
	return useCallback((props?: IDetailsColumnProps): JSX.Element => {
		const items = [
			{
				key: 'add',
				text: 'Add',
				iconOnly: true,
				iconProps: { iconName: 'Add' },
				onClick: () => console.log('add', props),
			},
			{
				key: 'edit',
				text: 'Edit',
				iconOnly: true,
				iconProps: { iconName: 'Edit' },
				onClick: () => console.log('edit', props),
			},
			{
				key: 'delete',
				text: 'Delete',
				iconOnly: true,
				iconProps: { iconName: 'Delete' },
				onClick: () => console.log('delete', props),
			},
		] as ICommandBarItemProps[]
		return createDefaultCommandBar({
			items,
			styles: {
				root: {
					display: 'flex',
					justifyContent: 'center',
				},
			},
		})
	}, [])
}

export function useCommandBar(
	table: ColumnTable | undefined,
	metadata: TableMetadata | undefined,
	setTable: React.Dispatch<SetStateAction<ColumnTable | undefined>>,
	setMetadata: React.Dispatch<SetStateAction<TableMetadata | undefined>>,
): JSX.Element {
	const theme = useThematic()
	const addNewColumn = useCallback(() => {
		if (!table || !metadata) return
		console.time('new column')
		const newTable = table.derive(
			{ [`New ${Math.round(Math.random() * 100)}`]: (d: Struct) => d.Close },
			{ before: 'Date' },
		)
		console.timeEnd('new column')
		// since we're just appending, we can reuse the prior stats
		console.time('new meta')
		const newColumns = newTable.columnNames(name => !metadata.columns[name])
		const newMetadata = introspect(newTable, true, newColumns)
		console.timeEnd('new meta')
		setMetadata({
			...newMetadata,
			columns: {
				...metadata.columns,
				...newMetadata.columns,
			},
		})
		setTable(newTable)
	}, [table, setMetadata, setTable, metadata])
	return useMemo(() => {
		return createDefaultHeaderCommandBar(
			{
				items: [
					{
						key: 'add-column',
						text: 'Add column',
						iconProps: {
							iconName: 'Add',
						},
						onClick: addNewColumn,
					},
				],
			},
			theme,
		)
	}, [theme, addNewColumn])
}
