/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { getValue } from '../ArqueroDetailsList.utils.js'
import { useTextAlignStyle } from './hooks.js'
import type { FormattedCellProps } from './types.js'

/**
 * Basic rendering of boolean values as true/false text.
 */
export const BooleanTextCell: React.FC<FormattedCellProps> = memo(
	function TextCell({ item, column, textAlign = 'right' }) {
		const value = !!getValue(item, column)
		const style = useTextAlignStyle(textAlign)

		return <div style={style}>{value.toString()}</div>
	},
)
