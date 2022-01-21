/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	TableMetadata,
	introspect,
	ColumnMetadata,
} from '@data-wrangling-components/core'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
} from '@data-wrangling-components/react'
import { createLazyLoadingGroupHeader } from '@data-wrangling-components/react/src/ArqueroDetailsList/renderers'
import {
	CommandBar,
	DefaultButton,
	IColumn,
	ICommandBarItemProps,
	IDetailsGroupDividerProps,
	Pivot,
	PivotItem,
} from '@fluentui/react'
import { loadCSV } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { Struct } from 'arquero/dist/types/table/transformable'
import React, { memo, useState, useEffect, useCallback, useMemo } from 'react'
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
			let root = await loadCSV('data/stocks.csv', {})
			root = root.groupby(['Symbol', 'Month'])
			let meta = introspect(root, true)
			setGroupedTable(root)
			setGroupedMetadata(meta)
			root.ungroup()
			// make sure we have a large enough number of rows to impact rendering perf
			for (let i = 0; i < 6; i++) {
				root = root.concat(root)
			}
			meta = introspect(root, true)
			setTable(root)
			setMetadata(meta)
		}
		f()
	}, [])

	const addNewColumn = useCallback(() => {
		if (!table) return
		const newTable = table.derive(
			{ [Math.random()]: (d: Struct) => d.Close },
			{ before: 'Date' },
		)
		const newMetadata = introspect(newTable, true)
		setMetadata(newMetadata)
		setTable(newTable)
	}, [table, setMetadata, setTable])

	const customGroupHeader = useCallback(
		(meta?: ColumnMetadata, props?: IDetailsGroupDividerProps | undefined) => {
			const custom = <h3>{meta?.name}</h3>

			return createLazyLoadingGroupHeader(props, meta, custom)
		},
		[],
	)

	const myCommand = useCallback(() => {
		const _items = [
			{
				key: 'edit',
				text: 'Edit',
				iconOnly: true,
				iconProps: { iconName: 'Edit' },
			},
			{
				key: 'delete',
				text: 'Delete',
				iconOnly: true,
				iconProps: { iconName: 'Delete' },
			},
			{
				key: 'add',
				text: 'Add',
				iconOnly: true,
				iconProps: { iconName: 'Add' },
			},
		] as ICommandBarItemProps[]
		return <CommandBar items={_items} />
	}, [])

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
			<p>
				Use the tabs to flip between a large table and an empty tab to profile
				re-mounting the table.
			</p>
			<Pivot>
				<PivotItem style={{ width: '96vw' }} key={'table'} headerText={'table'}>
					<AddButton onClick={addNewColumn}>Add new column</AddButton>
					<Table>
						<ArqueroTableHeader
							table={table}
							name={tableName}
							onRenameTable={name => setTableName(name)}
						/>
						<ArqueroDetailsList
							table={table}
							metadata={metadata}
							features={{
								smartCells: true,
								smartHeaders: true,
								commandBar: [myCommand],
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

const Container = styled.div``

const Table = styled.div`
	margin-top: 12px;
	height: 600px;
`

const AddButton = styled(DefaultButton)`
	margin-top: 8px;
`
