/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@thematic/core'

interface CollapsiblePanelStyles {
	header?: React.CSSProperties
	contents?: React.CSSProperties
}

export function getCollapsiblePanelStyles(
	theme: Theme,
): CollapsiblePanelStyles {
	return {
		header: {
			background: theme.application().background().hex(),
			color: theme.application().highContrast().hex(),
			padding: '8px 0',
			borderBottom: 'none',
			borderTop: 'none',
		},
		contents: {
			border: 'none',
			borderBottom: `1px solid ${theme.application().border().hex()}`,
		},
	}
}
