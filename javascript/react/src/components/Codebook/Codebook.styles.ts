/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'

import type { FieldHeights } from './Codebook.hooks.js'
import type { CodebookDefaultStyles } from './Codebook.types.js'

export function getRootStyle(
	theme: Theme,
	disabled?: boolean,
	style?: CSSProperties,
): CSSProperties {
	return {
		backgroundColor: disabled
			? theme.palette.neutralLighter
			: theme.palette.white,
		...style,
	}
}

export function useDefaultStyles(
	styles?: CodebookDefaultStyles,
	heights?: FieldHeights,
): CodebookDefaultStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			mapping: {
				root: {
					height: heights?.get('mappingWrapper'),
					...styles?.mapping?.root,
				},
				...styles?.mapping,
			},
			root: {
				width: 240,
				flex: 'none',
				border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				borderBottom: 'unset',
				...styles?.root,
			},
			name: {
				root: {
					padding: 10,
					height: heights?.get('name'),
					borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				},
				...styles?.name,
			},
			description: {
				root: {
					padding: 10,
					height: heights?.get('description'),
					borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				},
				...styles?.description,
			},
			units: {
				root: {
					padding: 10,
					height: heights?.get('units'),
					borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				},
				...styles?.units,
			},
			dataType: {
				root: {
					padding: 10,
					height: heights?.get('dataType'),
					borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				},
				...styles?.dataType,
			},
			dataNature: {
				root: {
					padding: 10,
					height: heights?.get('dataNature'),
					borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				},
				...styles?.dataNature,
			},
			statsWrapper: {
				height: heights?.get('statsWrapper'),
				padding: 10,
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				...styles?.statsWrapper,
			},
		}),
		[theme, styles, heights],
	)
}
