/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import type { IColumn, IDropdownOption } from '@fluentui/react'
import { memo, useCallback, useEffect, useState } from 'react'

import { useColumns, useCommandBar, useFarCommandBar } from './Table.hooks.js'
import { Container, TableContainer } from './Table.styles.js'
import type { TableProps } from './Table.types.js'

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

	const columns = useColumns(config)
	const commandBar = useCommandBar(table, visibleColumns, setVisibleColumns)
	const farCommandBar = useFarCommandBar(table)

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
