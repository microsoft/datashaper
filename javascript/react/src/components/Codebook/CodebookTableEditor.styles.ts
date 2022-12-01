/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IDropdownStyles,
	IRawStyle,
	ITextFieldStyles,
} from '@fluentui/react'
import { useMemo } from 'react'

import type { FieldHeights } from './Codebook.hooks.js'
import { useDefaultStyles } from './Codebook.styles.js'
import type { CodebookTableStyles } from './CodebookTableEditor.types.js'

export function useTableDefaultStyles(
	styles?: CodebookTableStyles,
	heights?: FieldHeights,
): CodebookTableStyles {
	const defaultStyles = useDefaultStyles(styles, heights)
	return useMemo(
		() => ({
			...defaultStyles,
			statsWrapper: {
				...defaultStyles.statsWrapper,
				checkbox: {
					root: {
						visibility: 'visible',
					},
				},
			},
			labelWrapper: {
				marginTop: (defaultStyles?.statsWrapper?.root as IRawStyle)?.height,
				marginRight: 10,
				...styles?.labelWrapper,
			},
			displayName: {
				subComponentStyles: {
					label: {
						height: (defaultStyles?.displayName?.root as IRawStyle)?.height,
						padding: 'unset',
						whiteSpace: 'pre',
					},
				},
				...defaultStyles?.displayName,
			} as ITextFieldStyles,
			description: {
				subComponentStyles: {
					label: {
						height: (defaultStyles?.description?.root as IRawStyle).height,
						padding: 'unset',
					},
				},
				...defaultStyles?.description,
			} as ITextFieldStyles,
			units: {
				subComponentStyles: {
					label: {
						height: (defaultStyles?.units?.root as IRawStyle).height,
						padding: 'unset',
					},
				},
				...defaultStyles?.units,
			} as ITextFieldStyles,
			tableWrapper: {
				display: 'flex',
				...styles?.tableWrapper,
			},
			dataType: {
				title: { border: 'unset' },
				label: {
					height: (defaultStyles?.dataType?.root as IRawStyle).height,
					padding: 'unset',
				},
				...defaultStyles?.dataType,
			} as IDropdownStyles,
			dataNature: {
				title: { border: 'unset' },
				label: {
					height: (defaultStyles?.dataType?.root as IRawStyle).height,
					padding: 'unset',
					whiteSpace: 'pre',
				},
				...defaultStyles?.dataNature,
			} as IDropdownStyles,
		}),
		[defaultStyles, styles],
	)
}
