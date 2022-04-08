/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IModalStyleProps, IModalStyles } from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'
import { useThematic } from '@thematic/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

/**
 * Defaults modal to have a slight border that is adapted for theme
 * @param styles
 * @returns
 */
export function useModalStyles(
	styles?: IStyleFunctionOrObject<IModalStyleProps, IModalStyles>,
	includeGuidance = false,
	hasSelectedStep = false,
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> {
	const theme = useThematic()
	return useMemo(() => {
		return merge(
			{
				root: {
					border: `1px solid ${theme.application().faint().hex()}`,
					width: includeGuidance ? 800 : 360,
					maxHeight: 580,
					// TODO: validate if fixed height is needed
					// height: !hasSelectedStep ? 'auto' : 580,
				},
			},
			styles,
		)
	}, [theme, styles, includeGuidance, hasSelectedStep])
}
