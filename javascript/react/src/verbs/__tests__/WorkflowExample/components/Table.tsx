/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import type { IColumn, IDropdownOption } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'

import { useColumns, useFarCommandBar } from './Table.hooks.js'
import { Container, TableContainer } from './Table.styles.js'
import type { TableProps } from './Table.types.js'

export const Table: React.FC<TableProps> = memo(function Table({
	name,
	table,
	metadata,
	config,
	features = {},
	compact,
	onRenameTable,
}) {
	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()

	const columns = useColumns(config)

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
				farCommandBar={farCommandBar}
				onRenameTable={onRenameTable}
			/>
			<TableContainer>
				<ArqueroDetailsList
					table={table}
					metadata={metadata}
					columns={columns}
					features={features}
					compact={compact}
					selectedColumn={selectedColumn}
					onColumnClick={handleColumnClick}
					onCellDropdownSelect={handleCellDropdownSelect}
					clickableColumns
					sortable
					showColumnBorders
					isHeaderFixed
				/>
			</TableContainer>
		</Container>
	)
})
