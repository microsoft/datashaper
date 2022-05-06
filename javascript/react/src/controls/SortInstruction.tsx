/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@essex/arquero'
import { IconButton } from '@fluentui/react'
import { memo } from 'react'

import {
	useHandleColumnChange,
	useHandleDirectionClick,
} from './SortInstruction.hooks.js'
import { Container, icons } from './SortInstruction.styles.js'
import type { SortInstructionProps } from './SortInstruction.types.js'
import { TableColumnDropdown } from './TableColumnDropdown.js'

/**
 * Provides a column dropdown, asc/desc toggle, and delete button for editing a table sort.
 */
export const SortInstruction: React.FC<SortInstructionProps> = memo(
	function SortInstruction({ columnOptions, order, onChange, onDelete }) {
		const { column, direction } = order
		const isAscending = direction === SortDirection.Ascending
		const directionName = isAscending ? 'Ascending' : 'Descending'
		const handleColumnChange = useHandleColumnChange(order, onChange)
		const handleDirectionClick = useHandleDirectionClick(order, onChange)

		return (
			<Container>
				<TableColumnDropdown
					options={columnOptions}
					label={undefined}
					selectedKey={column}
					onChange={handleColumnChange}
				/>
				<IconButton
					toggle
					checked={isAscending}
					title={directionName}
					iconProps={{ iconName: directionName }}
					onClick={handleDirectionClick}
				/>
				<IconButton
					title={'Remove this sort'}
					iconProps={icons.delete}
					onClick={onDelete}
				/>
			</Container>
		)
	},
)
