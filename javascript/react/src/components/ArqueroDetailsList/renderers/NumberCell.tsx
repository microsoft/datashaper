/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { getValue } from '../ArqueroDetailsList.utils.js'
import { useFormattedNumber } from '../hooks/index.js'
import { useTextAlignStyle } from './hooks.js'
import type { FormattedCellProps } from './types.js'

/**
 * Basic endering of number values.
 */
export const NumberCell: React.FC<FormattedCellProps> = memo(
	function NumberCell({ item, column, textAlign = 'right', numberFormat }) {
		const value = getValue(item, column)
		const printed = useFormattedNumber(value, numberFormat)
		const style = useTextAlignStyle(textAlign)
		return <div style={style}>{printed}</div>
	},
)
