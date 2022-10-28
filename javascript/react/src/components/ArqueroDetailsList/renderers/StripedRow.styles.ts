/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IDetailsRowStyleProps,
	IDetailsRowStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import { useMemo } from 'react'

import type { RichRowProps } from './types.js'

export function useStyles({
	striped,
	itemIndex,
	columnBorders,
	compact,
	styles,
}: RichRowProps): IStyleFunctionOrObject<
	IDetailsRowStyleProps,
	IDetailsRowStyles
> {
	const theme = useThematicFluent()
	return useMemo(() => {
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
}
