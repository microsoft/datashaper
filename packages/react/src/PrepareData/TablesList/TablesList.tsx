/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableContainer } from '@data-wrangling-components/core'
import { DetailsList, IColumn, SelectionMode } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

const columns: IColumn[] = [
	{
		name: 'name',
		fieldName: 'name',
		key: 'name',
		minWidth: 20,
	},
]

export const TablesList: React.FC<{
	files: Map<string, ColumnTable>
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TablesList({ files, onSelect, selected }) {
	const list = useMemo((): TableContainer[] => {
		return Array.from(files).map(([key, table]) => {
			return {
				name: key,
				table,
			} as TableContainer
		})
	}, [files])

	const isTableSelected = useCallback(
		(tableName: string): boolean => selected === tableName,
		[selected],
	)

	return (
		<ListContainer>
			<DetailsList
				isHeaderVisible={false}
				items={[...list]} //strategy to update list when updating properties
				columns={columns}
				selectionMode={SelectionMode.none}
				onRenderRow={(props, defaultRender) =>
					defaultRender ? (
						<TableSelect
							selected={isTableSelected(props?.item.name)}
							onClick={() => onSelect && onSelect(props?.item.name)}
						>
							{defaultRender(props)}
						</TableSelect>
					) : null
				}
			/>
		</ListContainer>
	)
})

const ListContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: auto;
`

const TableSelect = styled.div<{ selected: boolean }>`
	cursor: pointer;
	.ms-DetailsRow-cell {
		background-color: ${({ theme, selected }) =>
			selected ? theme.application().faint().hex() : 'inherit'};
	}
`
