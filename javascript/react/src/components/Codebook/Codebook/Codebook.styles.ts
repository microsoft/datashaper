/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IRawStyle } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import { FIELD_PADDING, LABEL_TOP_PADDING } from '../constants.js'
import { useDefaultCodebookStyles } from '../styles.js'
import type { FieldHeights } from '../types.js'
import type { CodebookTableStyles } from './Codebook.types.js'

/**
 * This set of styles modifies the field-specific editor style to look better as a table.
 * For example:
 * - removes borders from all inputs
 * - moves the per-input labels to a fixed left column
 * - adjusts padding so labels and starting text values all line up nicely
 * - adds a border to the bottom of each row
 * - forces the label height of each input to match the known cell height so it stays aligned
 * @param styles
 * @param heights
 * @returns
 */
export function useTableStyles(
	styles?: CodebookTableStyles,
	heights?: FieldHeights,
): CodebookTableStyles {
	const theme = useTheme()
	const defaultStyles = useDefaultCodebookStyles(heights)
	return useMemo(() => {
		const border = `1px solid ${theme.palette.neutralTertiaryAlt}`
		// with a "table look", we want borders. we also need to restore the
		// padding that the individual field version got from the within-cell labels
		const cellBase = {
			root: {
				paddingTop: FIELD_PADDING,
				borderBottom: border,
			},
		}
		return merge(
			defaultStyles,
			{
				tableWrapper: {
					display: 'flex',
				},
				labelWrapper: {
					marginTop: (defaultStyles?.statsWrapper?.root as IRawStyle)?.height,
					textAlign: 'right',
					marginRight: 10,
					whiteSpace: 'pre',
				},
				statsWrapper: {
					checkbox: {
						root: {
							visibility: 'visible',
						},
					},
					root: {
						borderBottom: border,
					},
				},
				displayName: {
					subComponentStyles: {
						label: {
							height: (defaultStyles?.displayName?.root as IRawStyle)?.height,
							paddingTop: LABEL_TOP_PADDING,
						},
					},
					...cellBase,
				},
				description: {
					subComponentStyles: {
						label: {
							height: (defaultStyles?.description?.root as IRawStyle)?.height,
							paddingTop: LABEL_TOP_PADDING,
						},
					},
					field: {
						paddingTop: 8,
					},
					...cellBase,
				},
				dataType: {
					title: { border: 'unset', paddingTop: 2 },
					label: {
						height: (defaultStyles?.dataType?.root as IRawStyle)?.height,
						paddingTop: LABEL_TOP_PADDING,
					},
					...cellBase,
				},
				dataNature: {
					title: { border: 'unset', paddingTop: 2 },
					label: {
						height: (defaultStyles?.dataNature?.root as IRawStyle)?.height,
						paddingTop: LABEL_TOP_PADDING,
					},
					...cellBase,
				},
				units: {
					subComponentStyles: {
						label: {
							height: (defaultStyles?.units?.root as IRawStyle)?.height,
							paddingTop: LABEL_TOP_PADDING,
						},
					},
					...cellBase,
				},
				mapping: {
					label: {
						root: {
							paddingTop: LABEL_TOP_PADDING,
						},
					},
					root: {
						paddingTop: FIELD_PADDING,
					},
				},
			},
			styles,
		)
	}, [theme, defaultStyles, styles])
}
