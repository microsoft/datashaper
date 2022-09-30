/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useMemo } from 'react'

import type { FormattedCellProps } from './types.js'

/**
 * Standard rendering of Blank values (completely empty cell).
 */
export const BlankCell: React.FC<FormattedCellProps> = memo(
	function BlankCell() {
		const style = useMemo(
			() => ({
				width: '100%',
			}),
			[],
		)
		return <div style={style} />
	},
)
