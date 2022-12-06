/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IRawStyle } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
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
		() =>
			merge(
				{
					statsWrapper: {
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
					},
					description: {
						subComponentStyles: {
							label: {
								height: (defaultStyles?.description?.root as IRawStyle).height,
								padding: 'unset',
							},
						},
					},
					units: {
						subComponentStyles: {
							label: {
								height: (defaultStyles?.units?.root as IRawStyle).height,
								padding: 'unset',
							},
						},
					},
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
					},
					dataNature: {
						title: { border: 'unset' },
						label: {
							height: (defaultStyles?.dataType?.root as IRawStyle).height,
							padding: 'unset',
							whiteSpace: 'pre',
						},
					},
				},
				defaultStyles,
			),
		[defaultStyles, styles],
	)
}
