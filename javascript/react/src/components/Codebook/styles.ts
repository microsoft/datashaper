/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCheckboxProps } from '@essex/components'
import type { IDropdownStyles, ITextFieldStyles, Theme } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'

import { FIELD_PADDING } from './constants.js'
import type { CodebookStyles, FieldHeights } from './types.js'

export function getRootStyle(
	theme: Theme,
	disabled?: boolean,
	style?: CSSProperties,
	last = false,
): CSSProperties {
	return merge(
		{
			backgroundColor: disabled
				? theme.palette.neutralLighter
				: theme.palette.white,
			border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
			borderRight: last
				? `1px solid ${theme.palette.neutralTertiaryAlt}`
				: 'none',
		},
		style,
	)
}

/**
 * Generates the default codebook styles
 * @param styles - The styles input object
 * @param heights  - The field heights to use
 * @returns - A set of codebook styles to use
 */
export function useDefaultCodebookStyles(
	heights?: FieldHeights,
): CodebookStyles {
	const theme = useTheme()
	const checkbox = useCheckboxProps(
		{
			styles: {
				root: {
					visibility: 'hidden',
				},
			},
		},
		'small',
	)
	return useMemo(() => {
		const cellBase = {
			padding: FIELD_PADDING,
			paddingTop: 0,
		}
		return {
			root: {
				width: 240,
				flex: 'none',
				backgroundColor: theme.palette.white,
			},
			name: {
				root: {
					height: heights?.get('name'),
					padding: FIELD_PADDING,
					paddingBottom: 0,
					paddingTop: 2,
				},
				checkbox: checkbox.styles,
			},
			statsWrapper: {
				root: {
					height: heights?.get('statsWrapper'),
					padding: FIELD_PADDING,
					paddingBottom: 0,
					paddingTop: 2,
				},
			},
			displayName: {
				root: {
					height: heights?.get('displayName'),
					...cellBase,
				},
			} as ITextFieldStyles,
			description: {
				root: {
					height: heights?.get('description'),
					...cellBase,
				},
			} as ITextFieldStyles,
			dataType: {
				root: {
					height: heights?.get('dataType'),
					...cellBase,
				},
			} as IDropdownStyles,
			dataNature: {
				root: {
					height: heights?.get('dataNature'),
					...cellBase,
				},
			} as IDropdownStyles,
			units: {
				root: {
					height: heights?.get('units'),
					...cellBase,
				},
			} as ITextFieldStyles,
			mapping: {
				root: {
					height: heights?.get('mappingWrapper'),
					...cellBase,
				},
			},
		}
	}, [theme, heights, checkbox])
}
