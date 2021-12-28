/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsColumnStyles } from '@fluentui/react'
import { useMemo } from 'react'

export function useColumnStyles(
	clickable: boolean,
	sortable: boolean,
): Partial<IDetailsColumnStyles> {
	return useMemo(
		() => ({
			// we add our own sort icon in the DefaultColumnHeader component
			// this is because the onRenderHeader column function only
			// affects an inner div, which can be compressed when sorting is present
			// we therefore render it ourselves so we can control the layout completely.
			sortIcon: {
				display: 'none',
			},
			root: {
				cursor: clickable || sortable ? 'pointer' : 'default',
			},
		}),
		[clickable, sortable],
	)
}
