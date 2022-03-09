/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { TableColumnDropdown } from './TableColumnDropdown.js'

export interface ColumnInstructionProps {
	table?: ColumnTable
	column: string
	onChange?: (column: string) => void
	onDelete?: () => void
}

/**
 * Provides a column dropdown and delete button for editing a list of columns.
 */
export const ColumnInstruction: React.FC<ColumnInstructionProps> = memo(
	function ColumnInstruction({ table, column, onChange, onDelete }) {
		const handleColumnChange = useCallback(
			(_e, opt) => {
				onChange && onChange(opt.key)
			},
			[onChange],
		)

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
					title={'Remove this column'}
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
