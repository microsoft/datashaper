/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ColumnMetadata,
	TableMetadata,
} from '@data-wrangling-components/core'
import { introspect } from '@data-wrangling-components/core'
import {
	createDefaultCommandBar,
	createDefaultHeaderCommandBar,
	createLazyLoadingGroupHeader,
} from '@data-wrangling-components/react'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
} from '@data-wrangling-components/react-arquero'
import type {
	IColumn,
	ICommandBarItemProps,
	IDetailsColumnProps,
	IDetailsGroupDividerProps,
} from '@fluentui/react'
import { Pivot, PivotItem } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { Struct } from 'arquero/dist/types/table/transformable'
import type { SetStateAction } from 'react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
/**
 * This is just a rudimentary page to load a large table for profiling the ArqueroDetailsList rendering.
 */
export const PerfPage: React.FC = memo(function PerfMage() {
	const [table, setTable] = useState<ColumnTable | undefined>()
	const [tableName, setTableName] = useState('Table1')
	const [groupedTable, setGroupedTable] = useState<ColumnTable | undefined>()
	const [groupedMetadata, setGroupedMetadata] = useState<
		TableMetadata | undefined
	>()
	const [metadata, setMetadata] = useState<TableMetadata | undefined>()

	useEffect(() => {
		const f = async () => {
			let root = await loadCSV('data/stocks.csv', {
				autoMax: 1000000,
			})
			const grouped = root.groupby(['Symbol', 'Month'])
			const groupedMeta = introspect(root, true)
			setGroupedTable(grouped)
			setGroupedMetadata(groupedMeta)
			root.ungroup()
			// make sure we have a large enough number of rows to impact rendering perf
			for (let i = 0; i < 10; i++) {
				root = root.concat(root)
			}
			console.time('root meta')
			const meta = introspect(root, true)
			console.timeEnd('root meta')
			setTable(root)
			setMetadata(meta)
		}
		f()
	}, [])

	const commandBar = useCommandBar(table, metadata, setTable, setMetadata)
	const columnCommands = useColumnCommands()

	const customGroupHeader = useCallback(
		(
			meta?: ColumnMetadata,
			columnName?: string,
			props?: IDetailsGroupDividerProps | undefined,
		) => {
			const custom = <h3>{meta?.name}</h3>
			return createLazyLoadingGroupHeader(props, custom, columnName, meta)
		},
		[],
	)

	const columns = useMemo((): IColumn[] | undefined => {
		if (!table) return undefined
		return table.columnNames().map(x => {
			return {
				name: x,
				key: x,
				fieldName: x,
				minWidth: 180,
			} as IColumn
		})
	}, [table])

	if (!table || !metadata || !groupedTable || !groupedMetadata) {
		return null
	}

	return (
		<Container>
			<Pivot>
				<PivotItem style={{ width: '96vw' }} key={'table'} headerText={'table'}>
					<Table>
						<ArqueroTableHeader
							table={table}
							name={tableName}
							commandBar={commandBar}
							onRenameTable={name => setTableName(name)}
						/>
						<ArqueroDetailsList
							table={table}
							metadata={metadata}
							features={{
								smartCells: true,
								smartHeaders: true,
								commandBar: [columnCommands],
							}}
							columns={columns}
							isSortable
							isHeadersFixed
							isStriped
							showColumnBorders
						/>
					</Table>
				</PivotItem>
				<PivotItem key={'empty'} headerText={'empty'} />
				<PivotItem key={'grouped'} headerText={'grouped'}>
					<Table>
						<ArqueroTableHeader table={groupedTable} />
						<ArqueroDetailsList
							table={groupedTable}
							metadata={groupedMetadata}
							features={{
								smartCells: true,
								smartHeaders: true,
							}}
							onRenderGroupHeader={customGroupHeader}
							isSortable
						/>
					</Table>
				</PivotItem>
			</Pivot>
		</Container>
	)
})

const Container = styled.div`
	padding: 0px 20px 0px 20px;
`

const Table = styled.div`
	margin-top: 12px;
	height: calc(100vh - 220px);
`

function useColumnCommands() {
	return useCallback((props?: IDetailsColumnProps) => {
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

function useCommandBar(
	table: ColumnTable | undefined,
	metadata: TableMetadata | undefined,
	setTable: React.Dispatch<SetStateAction<ColumnTable | undefined>>,
	setMetadata: React.Dispatch<SetStateAction<TableMetadata | undefined>>,
) {
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
