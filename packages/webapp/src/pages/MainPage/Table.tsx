/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ColumnConfigMap,
	ArqueroDetailsList,
	DetailsListFeatures,
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
	features?: DetailsListFeatures
	compact?: boolean
}

export const Table: React.FC<TableProps> = memo(function Table({
	name,
	table,
	config = {},
	features = {},
	compact,
}) {
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

	return (
		<Container className="table-container">
			<Header>
				<H2>{name}</H2>
				<H3>{table.numRows()} rows</H3>
				<H3>{table.numCols()} cols</H3>
				<IconButton
					iconProps={{ iconName: 'Download' }}
					styles={buttonStyles}
					href={downloadUrl}
					download={name}
					type={'text/csv'}
				/>
			</Header>
			<TableContainer>
				<ArqueroDetailsList
					table={table}
					columns={columns}
					features={features}
					compact={compact}
					selectedColumn={selectedColumn}
					onColumnClick={handleColumnClick}
					isStriped={true}
					isColumnClickable={true}
					isSortable={true}
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
