/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export function useFileTreeStyle(): React.CSSProperties {
	const theme = useTheme()
	return useMemo(
		() => ({
			borderRight: `2px solid ${theme.palette.neutralTertiaryAlt}`,
		}),
		[theme],
	)
}
