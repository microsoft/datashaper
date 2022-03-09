/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyInstruction } from '@data-wrangling-components/core'
import { SortDirection } from '@data-wrangling-components/core'
import { IconButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { TableColumnDropdown } from './dropdowns/TableColumnDropdown.js'

export interface SortInstructionProps {
	table?: ColumnTable
	order: OrderbyInstruction
	onChange?: (order: OrderbyInstruction) => void
	onDelete?: () => void
}

/**
 * Provides a column dropdown, asc/desc toggle, and delete button for editing a table sort.
 */
export const SortInstruction: React.FC<SortInstructionProps> = memo(
	function SortInstruction({ table, order, onChange, onDelete }) {
		const { column, direction } = order
		const checked = direction === SortDirection.Ascending
		const directionName = checked ? 'Ascending' : 'Descending'

		const handleColumnChange = useCallback(
			(_e, opt) => {
				const update = {
					...order,
					column: opt.key,
				}
				onChange && onChange(update)
			},
			[order, onChange],
		)

		const handleDirectionClick = useCallback(() => {
			const update = {
				...order,
				direction:
					order.direction === SortDirection.Descending
						? SortDirection.Ascending
						: SortDirection.Descending,
			}
			onChange && onChange(update)
		}, [order, onChange])

		const handleDeleteClick = useCallback(
			() => onDelete && onDelete(),
			[onDelete],
		)

		return (
			<Container>
				<TableColumnDropdown
					table={table}
					label={undefined}
					selectedKey={column}
					onChange={handleColumnChange}
				/>
				<IconButton
					toggle
					checked={checked}
					title={directionName}
					iconProps={{ iconName: directionName }}
					onClick={handleDirectionClick}
				/>
				<IconButton
					title={'Remove this sort'}
					iconProps={{ iconName: 'Delete' }}
					onClick={handleDeleteClick}
				/>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
`
