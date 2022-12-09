/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

import type { CodebookMappingStyles } from './MappingFields.types.js'

export function useMappingStyles(
	disabled?: boolean,
	styles?: CodebookMappingStyles,
): CodebookMappingStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				display: 'flex',
				flexDirection: 'column',
				padding: '10px',
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
				backgroundColor: disabled
					? theme.palette.neutralLighter
					: theme.palette.white,
				...styles?.root,
			},
			dropdownStyles: { root: { width: 87 }, ...styles?.dropdownStyles },
			columnPairs: {
				marginTop: '8px',
				display: 'flex',
				flexDirection: 'column',
				gap: '5px',
				...styles?.columnPairs,
			},
			addButton: styles?.addButton,
		}),
		[styles, disabled, theme],
	)
}

export const addIconProps = { iconName: 'Add' }
