/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { useCallback } from 'react'

export function useHeaderStyle(): (isExpanded: boolean) => React.CSSProperties {
	const theme = useThematic()

	return useCallback(
		(isExpanded: boolean) => ({
			background: theme.application().background().hex(),
			color: theme.application().highContrast().hex(),
			borderTop: 'none',
			borderBottom: isExpanded
				? 'none'
				: `1px solid ${theme.application().border().hex()}`,
			padding: '8px 0',
		}),
		[theme],
	)
}
