/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { useCellStyle, useHandleColumnClick } from './CellContainer.hooks.js'
import { Container } from './CellContainer.styles.js'
import type { CellContainerProps } from './CellContainer.types.js'
export type { CellContainerProps } from './CellContainer.types.js'

export const CellContainer: React.FC<CellContainerProps> = memo(
	function CellContainer({ onClick, column, children }) {
		const handleColumnClick = useHandleColumnClick(column, onClick)
		const cellStyle = useCellStyle(column, onClick)

		return (
			<Container onClick={handleColumnClick} style={cellStyle}>
				{children}
			</Container>
		)
	},
)
