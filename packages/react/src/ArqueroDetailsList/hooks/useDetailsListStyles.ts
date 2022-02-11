/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsListStyles } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import merge from 'lodash/merge.js'
import { useMemo } from 'react'
import { DetailsListFeatures } from '../index.js'

/**
 * Create a DetailsHeader style with enough height to handle the options we've turned on.
 * Each one requires a small amount of vertical space that stacks up.
 * @param options
 * @returns
 */
export function useDetailsListStyles(
	isHeadersFixed: boolean,
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
						position: isHeadersFixed ? 'sticky' : 'inherit',
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
		[theme, isFeatureEnabled, styles, isHeadersFixed, hasColumnClick, compact],
	)
}
