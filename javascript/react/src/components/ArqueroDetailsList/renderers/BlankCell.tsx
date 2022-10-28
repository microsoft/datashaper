/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { style } from './BlankCell.styles.js'
import type { FormattedCellProps } from './types.js'

/**
 * Standard rendering of Blank values (completely empty cell).
 */
export const BlankCell: React.FC<FormattedCellProps> = memo(
	function BlankCell() {
		return <div style={style} />
	},
)
