/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, TextField } from '@fluentui/react'
import { memo } from 'react'

import { dropdownStyles } from '../../styles.js'
import { useHandleColumnChange } from './ColumnSpread.hooks.js'
import { Container, icons } from './ColumnSpread.styles.js'
import type { ColumnSpreadProps } from './ColumnSpread.types.js'

/**
 * Provides a column dropdown and delete button for editing a list of columns.
 */
export const ColumnSpread: React.FC<ColumnSpreadProps> = memo(
	function ColumnSpread({ column, onChange, onDelete }) {
		const handleColumnChange = useHandleColumnChange(onChange)

		return (
			<Container>
				<TextField
					value={column}
					onChange={handleColumnChange}
					styles={dropdownStyles}
				/>
				<IconButton
					title={'Remove this column'}
					iconProps={icons.delete}
					onClick={onDelete}
				/>
			</Container>
		)
	},
)
