/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailsRow } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'

import { RichRowProps } from './types.js'

/**
 * Render a striped DetailsRow
 */
export const StripedRow: React.FC<RichRowProps> = memo(function StripedRow(
	props,
) {
	const theme = useThematic()
	const { striped, columnBorders, styles, ...rest } = props
	const { itemIndex, compact } = props
	const customStyles = useMemo(() => {
		if (striped && itemIndex % 2 === 0) {
			return {
				root: {
					width: '100%',
					background: theme.application().faint().hex(),
				},
				cell: {
					borderRight: columnBorders
						? `1px solid ${theme.application().background().hex(0.5)}`
						: `1px solid transparent`,
					padding: 'unset',
				},
				...styles,
			}
		}
		return {
			root: {
				width: '100%',
				borderBottom: `1px solid ${theme.application().faint().hex()}`,
			},
			cell: {
				padding: 'unset',
				borderRight: columnBorders
					? `1px solid ${theme.application().faint().hex(0.5)}`
					: `1px solid transparent`,
				borderTop:
					itemIndex === 0
						? `1px solid ${theme.application().faint().hex()}`
						: 'none',
				borderBottom: compact
					? `1px solid ${theme.application().faint().hex()}`
					: 'none',
			},
			...styles,
		}
	}, [theme, striped, columnBorders, styles, itemIndex, compact])

	return <DetailsRow {...rest} styles={customStyles} />
})
