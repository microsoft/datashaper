/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { useCellDimensions } from '../hooks/index.js'
import { useBooleanCircleAttrs } from './BooleanSymbolCell.hooks.js'
import type { ColumnCellProps } from './types.js'

/**
 * Symbolic rendering of boolean values.
 */
export const BooleanSymbolCell: React.FC<ColumnCellProps> = memo(
	function BooleanSymbolCell({ item, column }) {
		const dimensions = useCellDimensions(column)
		const attrs = useBooleanCircleAttrs(dimensions, item, column)
		return (
			<svg width={dimensions.width} height={dimensions.height}>
				<circle {...attrs} />
			</svg>
		)
	},
)
