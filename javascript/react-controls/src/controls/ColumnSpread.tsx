/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { dropdownStyles } from '../styles.js'

export interface ColumnSpreadProps {
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
				opt && onChange?.(opt)
			},
			[onChange],
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
					onClick={onDelete}
				/>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
`
