/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITheme } from '@fluentui/react'

interface CollapsiblePanelStyles {
	header?: React.CSSProperties
	contents?: React.CSSProperties
}

export function getCollapsiblePanelStyles(
	theme: ITheme,
): CollapsiblePanelStyles {
	return {
		header: {
			background: theme.palette.white,
			color: theme.palette.neutralPrimary,
			padding: '8px 0',
			borderBottom: 'none',
			borderTop: 'none',
		},
		contents: {
			border: 'none',
			borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
		},
	}
}
