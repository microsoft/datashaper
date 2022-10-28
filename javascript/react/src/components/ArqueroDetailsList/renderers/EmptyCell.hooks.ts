/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export function useStyle(
	textAlign: React.CSSProperties['textAlign'] | undefined,
	virtual: boolean,
): React.CSSProperties {
	const theme = useTheme()
	return useMemo(
		() => ({
			width: '100%',
			textAlign,
			color: virtual ? 'transparent' : theme.palette.neutralTertiaryAlt,
		}),
		[theme, textAlign, virtual],
	)
}
