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
	createDefaultCommandBar,
	createLazyLoadingGroupHeader,
} from '@data-wrangling-components/react'
import {
	DefaultButton,
	IColumn,
	ICommandBarItemProps,
	IDetailsColumnProps,
	IDetailsGroupDividerProps,
	Pivot,
	PivotItem,
} from '@fluentui/react'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { Struct } from 'arquero/dist/types/table/transformable'
import { memo, useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useHelpFileContentSetter } from '../../states/helpFileContent.js'
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
	const setHelpFileContent = useHelpFileContentSetter()

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

	useEffect(() => {
		const content = `This page is intended to provide a simple way of assessing pipeline and rendering performance using a dev tools profiler.
		\nBy default a largish table is renderered on the main tab. You can toggle between this and the other tabs to assess whether rendering remains fast even with component mount/unmount.
		\nThe empty tab has nothing on it so you can easily compare how quickly an empty component renders compared to the fill table.
		\nThe grouped tab has a large table grouped by multiple columns to evaluate grouping performance and how the table's virtual rendering is affected.`

		setHelpFileContent(content)
	})

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

	const myCommand = useCallback((props?: IDetailsColumnProps) => {
		const items = [
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
			{
				key: 'add',
				text: 'Add',
				iconOnly: true,
				iconProps: { iconName: 'Add' },
				onClick: () => console.log('add', props),
			},
		] as ICommandBarItemProps[]
		return createDefaultCommandBar(items)
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

const Container = styled.div`
	padding: 0px 20px 0px 20px;
`

const Table = styled.div`
	margin-top: 12px;
	height: 600px;
`

const AddButton = styled(DefaultButton)`
	margin-top: 8px;
`
