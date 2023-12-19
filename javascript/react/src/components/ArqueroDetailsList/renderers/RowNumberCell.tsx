/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { Container } from './RowNumberCell.styles.js'
import type { FormattedCellProps } from './types.js'

/**
 * Standard rendering of Blank values (completely empty cell).
 */
export const RowNumberCell: React.FC<FormattedCellProps> = memo(
	function RowNumberCell({ index }) {
		return (
			<Container>
				<span>{index}</span>
			</Container>
		)
	},
)
