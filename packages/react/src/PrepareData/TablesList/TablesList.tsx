/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { ArqueroDetailsList, GroupedTable } from '../../index.js'
import { useGroupHeader } from './GroupHeader.js'
import { useRenderRow } from './RenderTableRow.js'
import { useColumns, useGroupedTable, useIsTableSelected } from './hooks.js'

export const TablesList: React.FC<{
	files: GroupedTable[]
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TablesList({ files, onSelect, selected }) {
	const table = useGroupedTable(files)
	const isTableSelected = useIsTableSelected(selected)
	const groupHeader = useGroupHeader()
	const renderRow = useRenderRow(isTableSelected)
	const columns = useColumns(onSelect)

	return (
		<ListContainer>
			<ArqueroDetailsList
				isHeaderVisible={false}
				table={table}
				columns={[...columns]}
				visibleColumns={['name', 'group']}
				onRenderGroupHeader={groupHeader}
				onRenderRow={renderRow}
				compact
			/>
		</ListContainer>
	)
})

const ListContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	width: 100%;
`
