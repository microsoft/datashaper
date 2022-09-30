/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useTheme } from '@fluentui/react'
import { memo, useMemo } from 'react'

import type { FormattedCellProps } from './types.js'

/**
 * Standard rendering of Empty values.
 */
export const EmptyCell: React.FC<FormattedCellProps> = memo(function EmptyCell({
	textAlign,
	virtual = false,
}) {
	const theme = useTheme()
	const style = useMemo(
		() => ({
			width: '100%',
			textAlign,
			color: virtual ? 'transparent' : theme.palette.neutralTertiaryAlt,
		}),
		[theme, textAlign, virtual],
	)
	return <div style={style}>&mdash;</div>
})
