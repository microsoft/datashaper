/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata } from '@data-wrangling-components/core'
import {
	ColumnConfigMap,
	ArqueroDetailsList,
	ArqueroTableHeader,
	DetailsListFeatures,
} from '@data-wrangling-components/react'
import {
	IconButton,
	IColumn,
	IDetailsGroupDividerProps,
	IDropdownOption,
	IGroup,
} from '@fluentui/react'
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

	const getTotalCount = useCallback((children: IGroup[]) => {
		let total = 0
		children.forEach(child => {
			total += child.count
			total += child.children ? getTotalCount(child.children) : 0
		})
		return total
	}, [])

	const handleRenderGroupHeader = useCallback(
		(
			columnMeta: ColumnMetadata | undefined,
			props: IDetailsGroupDividerProps | undefined,
		) => {
			if (!props) return null
			const { group, onToggleCollapse } = props

			return (
				<HeaderContainer groupLevel={group?.level as number}>
					<LevelButton
						onClick={() =>
							onToggleCollapse && onToggleCollapse(group as IGroup)
						}
						iconProps={{
							iconName: group?.isCollapsed ? 'ChevronRight' : 'ChevronDown',
						}}
					></LevelButton>
					<HeaderDetailsText>
						<Bold>{`${columnMeta?.name} - ${group?.name}` || group?.name}</Bold>
					</HeaderDetailsText>
					<HeaderDetailsText>Children: {group?.count}</HeaderDetailsText>
					{group?.children && (
						<HeaderDetailsText>
							Total Items: {getTotalCount(group?.children)}
						</HeaderDetailsText>
					)}
				</HeaderContainer>
			)
		},
		[getTotalCount],
	)

	return (
		<Container className="table-container">
			<ArqueroTableHeader
				name={name ?? ''}
				showRowCount={true}
				showColumnCount={true}
				allowDownload={true}
				table={table}
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
					onRenderGroupHeader={handleRenderGroupHeader}
					isColumnClickable
					isSortable
					showColumnBorders
					isHeadersFixed
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

const TableContainer = styled.div`
	overflow-y: scroll;
	overflow-x: scroll;
	height: 264px;
`

const HeaderContainer = styled.div<{ groupLevel: number }>`
	padding-left: ${({ groupLevel }) => `${groupLevel * 12}px`};
	display: flex;
	gap: 8px;
`

const LevelButton = styled(IconButton)`
	width: 5%;
`

const HeaderDetailsText = styled.span`
	align-self: center;
`

const Bold = styled.b``
