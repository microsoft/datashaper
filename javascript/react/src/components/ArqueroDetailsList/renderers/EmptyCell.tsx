/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { useStyle } from './EmptyCell.hooks.js'
import type { FormattedCellProps } from './types.js'

/**
 * Standard rendering of Empty values.
 */
export const EmptyCell: React.FC<FormattedCellProps> = memo(function EmptyCell({
	textAlign,
	virtual = false,
}) {
	const style = useStyle(textAlign, virtual)
	return <div style={style}>&mdash;</div>
})
