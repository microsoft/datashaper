/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ColumnConfigMap,
	ArqueroDetailsList,
	ArqueroTableHeader,
	useColumnDefaults,
} from '@data-wrangling-components/react'
import { IColumn, IconButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

export interface TableProps {
	name?: string
	table: ColumnTable
	config: ColumnConfigMap
	autoRender?: boolean
	compact?: boolean
}

export const Table: React.FC<TableProps> = memo(function Table({
	name,
	table,
	config = {},
	autoRender,
	compact,
}) {
	// note that we always reify the table for display, because some arquero operations
	// only create backing indexes (i.e., orderby, filter)
	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()
	const theme = useThematic()
	const buttonStyles = useMemo(
		() => ({
			root: {
				color: theme.application().background().hex(),
			},
		}),
		[theme],
	)
	// TODO: this would be better to do lazily because it copies the table data
	const downloadUrl = useMemo(() => {
		const blob = new Blob([table.toCSV()])
		return URL.createObjectURL(blob)
	}, [table])

	const configDefaults = useMemo(() => {
		return Object.entries(config).map(([key, conf]) => ({
			key,
			name: key,
			fieldName: key,
			minWidth: conf.width,
			iconName: conf.iconName,
		})) as IColumn[]
	}, [config])
	const columns = useColumnDefaults(table, autoRender, configDefaults, true)
	const handleColumnClick = useCallback(
		(evt, column) => setSelectedColumn(column.key),
		[setSelectedColumn],
	)
	return (
		<Container className="table-container">
			<ArqueroTableHeader
				name={name}
				numRows={table.numRows()}
				numCols={table.numCols()}
				downloadURL={downloadUrl}			
			/>
			<TableContainer>
				<ArqueroDetailsList
					table={table}
					columns={columns}
					autoRender={autoRender}
					compact={compact}
					selectedColumn={selectedColumn}
					onColumnClick={handleColumnClick}
				/>
			</TableContainer>
		</Container>
	)
})

const Container = styled.div`
	width: 400px;
	height: 300px;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const Header = styled.div`
	height: 36px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: ${({ theme }) => theme.application().accent().hex()};
`

const TableContainer = styled.div`
	overflow-y: scroll;
	overflow-x: scroll;
	height: 264px;
`

const H2 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme }) => theme.application().background().hex()};
`

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme }) => theme.application().background().hex()};
`
