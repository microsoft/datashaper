/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { useCallback } from 'react'

interface CollapsiblePanelStyles {
	header?: React.CSSProperties
	contents?: React.CSSProperties
}

export function useCollapsiblePanelStyles(): (
	isExpanded: boolean,
) => CollapsiblePanelStyles {
	const theme = useThematic()

	return useCallback(
		(isExpanded: boolean) => ({
			header: {
				background: theme.application().background().hex(),
				color: theme.application().highContrast().hex(),
				borderBottom: isExpanded
					? 'none'
					: `1px solid ${theme.application().border().hex()}`,
				borderTop: `1px solid ${theme.application().border().hex()}`,
				padding: '8px 0',
			},
			contents: {
				border: 'none',
			},
		}),
		[theme],
	)
}
