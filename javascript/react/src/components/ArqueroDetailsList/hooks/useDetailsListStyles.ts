/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsListStyles } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

import type { DetailsListFeatures } from '../index.js'

/**
 * Create a DetailsHeader style with enough height to handle the options we've turned on.
 * Each one requires a small amount of vertical space that stacks up.
 * @param options -
 * @returns
 */
export function useDetailsListStyles(
	isHeaderFixed: boolean,
	features?: DetailsListFeatures,
	styles?: IDetailsListStyles,
	hasColumnClick?: boolean,
	compact?: boolean,
): IDetailsListStyles {
	const theme = useThematic()

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
						background: theme.application().background().hex(),
						borderBottom: !isFeatureEnabled
							? `1px solid ${theme.application().faint().hex()}`
							: 'unset',
						selectors: {
							'.ms-DetailsHeader': {
								lineHeight: compact && !isFeatureEnabled ? 'normal' : '42px',
								height: 'auto',
								borderBottom: !isFeatureEnabled
									? `1px solid ${theme.application().faint().hex()}`
									: 'unset',
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
