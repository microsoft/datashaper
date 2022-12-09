/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
): CSSProperties {
	return merge(
		{
			backgroundColor: disabled
				? theme.palette.neutralLighter
				: theme.palette.white,
		},
		style,
	)
}

/**
 *
 * @param styles - The styles input object
 * @param heights  - The field heights to use
 * @returns - A set of codebook styles to use
 */
export function useDefaultCodebookStyles(
	styles?: CodebookStyles,
	heights?: FieldHeights,
): CodebookStyles {
	const theme = useTheme()
	const border = `1px solid ${theme.palette.neutralTertiaryAlt}`
	return useMemo(
		() =>
			merge(
				{
					mapping: {
						root: {
							height: heights?.get('mappingWrapper'),
						},
					},
					root: {
						width: 240,
						flex: 'none',
						border,
						borderBottom: 'unset',
					},
					displayName: {
						root: {
							padding: FIELD_PADDING,
							height: heights?.get('displayName'),
							borderBottom: border,
						},
					} as ITextFieldStyles,
					description: {
						root: {
							padding: FIELD_PADDING,
							height: heights?.get('description'),
							borderBottom: border,
						},
					} as ITextFieldStyles,
					units: {
						root: {
							padding: FIELD_PADDING,
							height: heights?.get('units'),
							borderBottom: border,
						},
					} as ITextFieldStyles,
					dataType: {
						root: {
							padding: FIELD_PADDING,
							height: heights?.get('dataType'),
							borderBottom: border,
						},
					} as IDropdownStyles,
					dataNature: {
						root: {
							padding: FIELD_PADDING,
							height: heights?.get('dataNature'),
							borderBottom: border,
						},
					} as IDropdownStyles,
					statsWrapper: {
						root: {
							height: heights?.get('statsWrapper'),
							padding: FIELD_PADDING,
							borderBottom: border,
						},
						checkbox: {
							root: {
								visibility: 'hidden',
							},
						},
					},
				},
				styles,
			),
		[border, styles, heights],
	)
}
