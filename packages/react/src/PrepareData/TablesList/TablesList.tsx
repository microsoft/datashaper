/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import React, { memo } from 'react'
import styled from 'styled-components'
import { ArqueroDetailsList, GroupedTable, useDeleteConfirm } from '../../'
import { DialogConfirm } from '../../DialogConfirm'
import { useGroupHeader } from './GroupHeader'
import { useRenderRow } from './RenderTableRow'
import { useColumns, useGroupedTable, useIsTableSelected } from './hooks'

export const TablesList: React.FC<{
	files: GroupedTable[]
	onSelect?: (name: string) => void
	onDelete?: (name: string) => void
	selected?: string
	steps?: Step[]
}> = memo(function TablesList({ files, onSelect, selected, onDelete, steps }) {
	const table = useGroupedTable(files)
	const isTableSelected = useIsTableSelected(selected)
	const groupHeader = useGroupHeader()
	const renderRow = useRenderRow(isTableSelected)
	const {
		onDeleteClicked,
		toggleDeleteModalOpen,
		isDeleteModalOpen,
		onConfirmDelete,
	} = useDeleteConfirm(onDelete)
	const columns = useColumns(onSelect, onDeleteClicked, steps)

	return (
		<ListContainer>
			{onDelete && (
				<DialogConfirm
					toggle={toggleDeleteModalOpen}
					title="Are you sure you want to delete this table?"
					subText="This action can't be undone."
					show={isDeleteModalOpen}
					onConfirm={onConfirmDelete}
				/>
			)}
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
	overflow: auto;
	width: 100%;
`
