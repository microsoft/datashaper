/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'
import { TableFile } from '../../types'
import styled from 'styled-components'
import { DetailsList, IColumn, SelectionMode } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

export const TablesList: React.FC<{
	files: Map<string, ColumnTable>
	onSelect?: (name: string) => void
}> = memo(function TablesList({ files, onSelect }) {
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

	return (
		<ListContainer>
			<DetailsList
				isHeaderVisible={false}
				items={list}
				columns={columns}
				selectionMode={SelectionMode.none}
				onRenderRow={(props, defaultRender) =>
					defaultRender ? (
						<TableSelect onClick={() => onSelect && onSelect(props?.item.name)}>
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
`

const TableSelect = styled.div`
	cursor: pointer;
`
