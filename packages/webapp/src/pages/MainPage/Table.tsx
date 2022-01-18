/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ColumnConfigMap,
	ArqueroDetailsList,
	ArqueroTableHeader,
	DetailsListFeatures,
	downloadCommand,
	visibleColumnsCommand,
} from '@data-wrangling-components/react'
import { IColumn, IDropdownOption } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { SetterOrUpdater } from 'recoil'
import styled from 'styled-components'

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

	const commands = useCommands(table, visibleColumns, setVisibleColumns)

	return (
		<Container className="table-container">
			<ArqueroTableHeader
				table={table}
				name={name ?? ''}
				showRowCount={true}
				showColumnCount={true}
				commands={commands}
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

function useCommands(
	table: ColumnTable,
	visibleColumns: string[],
	updateColumns: SetterOrUpdater<string[]>,
) {
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
	const dlcmd = useMemo(() => downloadCommand(table), [table])
	const vccmd = useMemo(
		() => visibleColumnsCommand(table, visibleColumns, handleColumnCheckChange),
		[table, visibleColumns, handleColumnCheckChange],
	)
	return useMemo(() => [dlcmd, vccmd], [dlcmd, vccmd])
}

const Container = styled.div`
	width: 400px;
	height: 300px;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const TableContainer = styled.div`
	overflow-y: scroll;
	overflow-x: scroll;
	height: 264px;
`
