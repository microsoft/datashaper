/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IModalStyleProps, IModalStyles } from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'
import type { Theme } from '@thematic/core'
import merge from 'lodash-es/merge.js'

/**
 * Defaults modal to have a slight border that is adapted for theme
 * @param styles
 * @returns
 */
export function getModalStyles(
	theme: Theme,
	styles?: IStyleFunctionOrObject<IModalStyleProps, IModalStyles>,
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> {
	return merge(
		{
			root: {
				border: `1px solid ${theme.application().faint().hex()}`,
				width: 'fit-content',
				maxHeight: 580,
			},
		},
		styles,
	)
}
