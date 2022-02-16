/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'
import type { FormattedCellProps } from './types.js'

/**
 * Standard rendering of Empty values.
 */
export const EmptyCell: React.FC<FormattedCellProps> = memo(function EmptyCell({
	textAlign,
}) {
	const theme = useThematic()
	const style = useMemo(
		() => ({
			textAlign,
			color: theme.application().lowContrast().hex(),
		}),
		[theme, textAlign],
	)
	return <div style={style}>&mdash;</div>
})
