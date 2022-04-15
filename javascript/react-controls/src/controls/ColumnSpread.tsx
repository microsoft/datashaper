/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, TextField } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { dropdownStyles } from '../styles.js'

export interface ColumnSpreadProps {
	table?: ColumnTable
	column: string
	onChange?: (column: string) => void
	onDelete?: () => void
}

/**
 * Provides a column dropdown and delete button for editing a list of columns.
 */
export const ColumnSpread: React.FC<ColumnSpreadProps> = memo(
	function ColumnSpread({ column, onChange, onDelete }) {
		const handleColumnChange = useCallback(
			(_e: any, opt: string | undefined) => {
				onChange && opt && onChange(opt)
			},
			[onChange],
		)

		const handleDeleteClick = useCallback(
			() => onDelete && onDelete(),
			[onDelete],
		)

		return (
			<Container>
				<TextField
					value={column}
					onChange={handleColumnChange}
					styles={dropdownStyles}
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
