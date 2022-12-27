/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import type { CodebookMappingStyles } from './MappingFields.types.js'

export function useMappingStyles(
	styles?: CodebookMappingStyles,
): CodebookMappingStyles {
	return useMemo(
		() =>
			merge(
				{
					root: {
						display: 'flex',
						flexDirection: 'column',
					},
					dropdownStyles: { root: { width: 87 } },
					columnPairs: {
						display: 'flex',
						flexDirection: 'column',
						gap: '5px',
					},
				},
				styles,
			),
		[styles],
	)
}

export const addIconProps = { iconName: 'Add' }
