/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsListStyles } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { merge } from 'lodash'
import { useMemo } from 'react'
import { DetailsListFeatures } from '..'

// this is the default built into fluent
// minus the excess header top padding
const DEFAULT_HEADER_HEIGHT = 45
// add this for histograms
const HISTOGRAM_HEIGHT = 28
// add this for a stats data block
const STATS_HEIGHT = 56

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
): IDetailsListStyles {
	const theme = useThematic()
	return useMemo(
		() =>
			merge(
				{},
				{
					root: {
						overflowX: 'scroll',
					},
					headerWrapper: {
						height:
							DEFAULT_HEADER_HEIGHT +
							(features?.smartHeaders || features?.histogramColumnHeaders
								? HISTOGRAM_HEIGHT
								: 0) +
							(features?.smartHeaders || features?.statsColumnHeaders
								? STATS_HEIGHT
								: 0),
						position: isHeadersFixed ? 'sticky' : 'inherit',
						zIndex: '2',
						top: '0',
						background: theme.application().background().hex(),
						borderBottom: `1px solid ${theme.application().faint().hex()}`,
					},
				},
				styles,
			),
		[theme, styles, features, isHeadersFixed],
	)
}
