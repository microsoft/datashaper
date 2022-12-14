/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsListStyles } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import type { ArqueroDetailsListFeatures } from '../index.js'

/**
 * Create a DetailsHeader style with enough height to handle the options we've turned on.
 * Each one requires a small amount of vertical space that stacks up.
 * @param options -
 * @returns
 */
export function useDetailsListStyles(
	isHeaderFixed: boolean,
	features?: ArqueroDetailsListFeatures,
	styles?: IDetailsListStyles,
	hasColumnClick?: boolean,
	compact?: boolean,
): IDetailsListStyles {
	const theme = useTheme()

	const isFeatureEnabled = useMemo((): any => {
		return (
			features?.smartHeaders ||
			features?.histogramColumnHeaders ||
			features?.statsColumnHeaders
		)
	}, [features])

	return useMemo(
		() =>
			merge(
				{},
				{
					headerWrapper: {
						position: isHeaderFixed ? 'sticky' : 'inherit',
						zIndex: '2',
						top: '0',
						background: theme.palette.white,
						selectors: {
							'.ms-DetailsHeader': {
								lineHeight: compact && !isFeatureEnabled ? 'normal' : '42px',
								height: 'auto',
							},
							'.ms-DetailsHeader-cell': {
								cursor: hasColumnClick ? 'pointer' : 'default',
								height: 'auto',
								padding: 'unset',
							},
						},
					},
				},
				styles,
			),
		[theme, isFeatureEnabled, styles, isHeaderFixed, hasColumnClick, compact],
	)
}
