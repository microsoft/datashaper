/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { getValue } from '../ArqueroDetailsList.utils.js'
import { useDateString } from './DateCell.hooks.js'
import { useTextAlignStyle } from './hooks.js'
import type { FormattedCellProps } from './types.js'

/**
 * Basic rendering of dates.
 */
export const DateCell: React.FC<FormattedCellProps> = memo(function DateCell({
	item,
	column,
	textAlign = 'right',
}) {
	const value = getValue(item, column)
	const style = useTextAlignStyle(textAlign)
	const text = useDateString(value)
	return <div style={style}>{text}</div>
})
