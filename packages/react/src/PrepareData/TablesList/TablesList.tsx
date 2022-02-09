/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailsList, IColumn, SelectionMode } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { TableFile } from '../../types'

export const TablesList: React.FC<{
	files: Map<string, ColumnTable>
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TablesList({ files, onSelect, selected }) {
	const list = useMemo((): TableFile[] => {
		return Array.from(files).map(([key, table]) => {
			return {
				name: key,
				table,
			} as TableFile
		})
	}, [files])

	const columns = useMemo(() => {
		return [
			{
				name: 'name',
				fieldName: 'name',
				key: 'name',
			},
		] as IColumn[]
	}, [])
	console.log(selected)
	return (
		<ListContainer>
			<DetailsList
				isHeaderVisible={false}
				items={[...list]}
				columns={columns}
				selectionMode={SelectionMode.none}
				onRenderRow={(props, defaultRender) =>
					defaultRender ? (
						<TableSelect
							selected={selected === props?.item.name}
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
	max-width: 20vw;
	overflow: auto;
`

const TableSelect = styled.div<{ selected: boolean }>`
	cursor: pointer;
	.ms-DetailsRow-cell {
		background-color: ${({ theme, selected }) =>
			selected ? theme.application().faint().hex() : 'inherit'};
	}
`
