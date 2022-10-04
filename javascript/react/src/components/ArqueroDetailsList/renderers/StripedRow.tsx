/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailsRow, useTheme } from '@fluentui/react'
import { memo, useMemo } from 'react'

import type { RichRowProps } from './types.js'

/**
 * Render a striped DetailsRow
 */
export const StripedRow: React.FC<RichRowProps> = memo(function StripedRow({
	striped,
	columnBorders,
	styles,
	...props
}) {
	const theme = useTheme()
	const { itemIndex, compact } = props
	const customStyles = useMemo(() => {
		return {
			root: {
				width: '100%',
				background:
					striped && itemIndex % 2 === 0
						? theme.palette.neutralLighterAlt
						: 'none',
			},
			cell: {
				borderRight: columnBorders
					? `1px solid ${theme.palette.neutralLighter}`
					: `1px solid transparent`,
				borderBottom: compact
					? `1px solid ${theme.palette.neutralLighter}`
					: 'none',
				padding: 'unset',
			},
			...styles,
		}
	}, [theme, striped, columnBorders, styles, itemIndex, compact])

	return <DetailsRow {...props} styles={customStyles} />
})
