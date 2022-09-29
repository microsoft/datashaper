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
		if (striped && itemIndex % 2 === 0) {
			return {
				root: {
					width: '100%',
					background: theme.palette.neutralLighterAlt,
				},
				cell: {
					borderRight: columnBorders
						? `1px solid ${theme.palette.neutralLighter}`
						: `1px solid transparent`,
					padding: 'unset',
				},
				...styles,
			}
		}
		return {
			root: {
				width: '100%',
				borderBottom: `1px solid ${theme.palette.neutralLighter}`,
			},
			cell: {
				padding: 'unset',
				borderRight: columnBorders
					? `1px solid ${theme.palette.neutralLighter}`
					: `1px solid transparent`,
				borderTop: 'none',
				borderBottom: compact
					? `1px solid ${theme.palette.neutralLighter}`
					: 'none',
			},
			...styles,
		}
	}, [theme, striped, columnBorders, styles, itemIndex, compact])

	return <DetailsRow {...props} styles={customStyles} />
})
