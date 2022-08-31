/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useHeaderStyle(): React.CSSProperties {
	const theme = useThematic()

	return useMemo(
		() => ({
			background: theme.application().background().hex(),
			color: theme.application().highContrast().hex(),
			borderTop: 'none',
			borderBottom: `1px solid ${theme.application().border().hex()}`,
			padding: '8px 0',
		}),
		[theme],
	)
}

export function usePanelStyle() {
	const theme = useThematic()

	return useMemo(
		() => ({
			content: {
				padding: '0',
			},
			headerText: {
				fontWeight: 'bold',
				color: theme.application().midContrast().hex(),
			},
			commands: {
				backgroundColor: theme.application().background().hex(),
				padding: '1rem 0 2rem',
				borderBottom: `1px solid ${theme.application().border().hex()}`,
			},
		}),
		[theme],
	)
}
