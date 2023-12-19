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
import { DEFAULT_ROW_HEIGHT } from '../ArqueroDetailsList.constants.js'
import type { RichRowProps } from './types.js'

export function useStyles({
	striped,
	itemIndex,
	columnBorders,
	compact,
	compactRowHeight,
	styles,
	hideRowNumber,
}: RichRowProps): IStyleFunctionOrObject<
	IDetailsRowStyleProps,
	IDetailsRowStyles
> {
	const theme = useThematicFluent()
	return useMemo(() => {
		const style = {
			root: {
				minHeight: compact ? compactRowHeight : DEFAULT_ROW_HEIGHT,
				height: compact ? compactRowHeight : DEFAULT_ROW_HEIGHT,
				width: '100%',
				background:
					striped && itemIndex % 2 === 0
						? theme.palette.neutralLighterAlt
						: 'none',
			},
			cell: {
				minHeight: compact ? compactRowHeight : DEFAULT_ROW_HEIGHT,
				height: compact ? compactRowHeight : DEFAULT_ROW_HEIGHT,
				borderRight: columnBorders
					? `1px solid ${theme.palette.neutralLighter}`
					: '1px solid transparent',
				borderBottom: compact
					? `1px solid ${theme.palette.neutralLighter}`
					: 'none',
				padding: 'unset',
			},
			fields: {},
			...styles,
		}
		if (!hideRowNumber) {
			style.fields = {
				'.ms-DetailsRow-cell:first-child > div': {
					color: theme.palette.neutralQuaternary,
					fontSize: '12px',
				},
			}
		}
		return style
	}, [
		theme,
		striped,
		columnBorders,
		styles,
		itemIndex,
		compact,
		compactRowHeight,
		hideRowNumber,
	])
}
