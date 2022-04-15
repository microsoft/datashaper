/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DetailsListFeatures } from '@data-wrangling-components/react'
import { 	ArqueroDetailsList,
	ArqueroTableHeader,
createDefaultHeaderCommandBar ,
	downloadCommand,
	visibleColumnsCommand,
} from '@data-wrangling-components/react'
import type { IColumn, IDropdownOption } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import type { SetterOrUpdater } from 'recoil'
import styled from 'styled-components'

export interface ColumnConfig {
	width?: number
	iconName?: string
}

export type ColumnConfigMap = Record<string, ColumnConfig>

export interface TableProps {
	name?: string
	table: ColumnTable
	config: ColumnConfigMap
	features?: DetailsListFeatures
	compact?: boolean
	onRenameTable?: (name: string) => void
}

export const Table: React.FC<TableProps> = memo(function Table({
	name,
	table,
	config = {},
	features = {},
	compact,
	onRenameTable,
}) {
	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()
	const [visibleColumns, setVisibleColumns] = useState<string[]>(
		table.columnNames(),
	)

	useEffect(() => {
		setVisibleColumns(table.columnNames())
	}, [table, setVisibleColumns])

	const columns = useMemo(() => {
		return Object.entries(config).map(([key, conf]) => ({
			key,
			name: key,
			fieldName: key,
			minWidth: conf.width,
			iconName: conf.iconName,
		})) as IColumn[]
	}, [config])

	const handleColumnClick = useCallback(
		(evt?: React.MouseEvent<HTMLElement>, column?: IColumn) =>
			setSelectedColumn(column?.key),
		[setSelectedColumn],
	)

	const handleCellDropdownSelect = useCallback(
		(
			evt: React.FormEvent<HTMLDivElement>,
			option?: IDropdownOption<any> | undefined,
		) => {
			console.log('option selected: ', option)
			alert(`Value selected: ${option?.text}`)
		},
		[],
	)

	const commandBar = useCommandBar(table, visibleColumns, setVisibleColumns)
	const farCommandBar = useFarCommandBar(table)

	return (
		<Container className="table-container">
			<ArqueroTableHeader
				table={table}
				name={name}
				showRowCount={true}
				showColumnCount={true}
				commandBar={commandBar}
				farCommandBar={farCommandBar}
				visibleColumns={visibleColumns}
				onRenameTable={onRenameTable}
			/>
			<TableContainer>
				<ArqueroDetailsList
					table={table}
					columns={columns}
					features={features}
					compact={compact}
					selectedColumn={selectedColumn}
					onColumnClick={handleColumnClick}
					onCellDropdownSelect={handleCellDropdownSelect}
					isColumnClickable
					isSortable
					showColumnBorders
					isHeadersFixed
					visibleColumns={visibleColumns}
				/>
			</TableContainer>
		</Container>
	)
})

function useCommandBar(
	table: ColumnTable,
	visibleColumns: string[],
	updateColumns: SetterOrUpdater<string[]>,
) {
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

function useFarCommandBar(table: ColumnTable) {
	const theme = useThematic()
	const items = useMemo(() => [downloadCommand(table)], [table])
	return useMemo(
		() => createDefaultHeaderCommandBar({ items }, theme, true),
		[items, theme],
	)
}

const Container = styled.div`
	width: 600px;
	height: 400px;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const TableContainer = styled.div`
	height: 364px;
`
