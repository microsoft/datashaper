/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type { FieldHeights } from './Codebook.hooks.js'
import { useDefaultStyles } from './Codebook.styles.js'
import type { CodebookTableStyles } from './CodebookTableEditor.types.js'

export function useTableDefaultStyles(
	styles?: CodebookTableStyles,
	disabled?: boolean,
	heights?: FieldHeights,
): CodebookTableStyles {
	const defaultStyles = useDefaultStyles(styles, heights)
	return useMemo(
		() => ({
			...defaultStyles,
			labelWrapper: {
				marginTop: defaultStyles?.statsWrapper?.height,
				marginRight: 10,
				...styles?.labelWrapper,
			},
			label: {
				padding: 'unset',
				whiteSpace: 'pre',
				...styles?.label,
			},
			tableWrapper: {
				display: 'flex',
				...styles?.tableWrapper,
			},
			dataType: {
				title: { border: 'unset' },
				...defaultStyles?.dataType,
			},
			dataNature: {
				title: { border: 'unset' },
				...defaultStyles?.dataNature,
			},
		}),
		[defaultStyles, styles],
	)
}
