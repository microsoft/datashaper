/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsListStyles } from '@fluentui/react'
import { merge } from 'lodash'
import { useMemo } from 'react'
import { DetailsListFeatures } from '..'

// this is the default built into fluent
const DEFAULT_HEADER_HEIGHT = 60
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
	features?: DetailsListFeatures,
	styles?: IDetailsListStyles,
): IDetailsListStyles {
	return useMemo(
		() =>
			merge(
				{},
				{
					headerWrapper: {
						height:
							DEFAULT_HEADER_HEIGHT +
							(features?.autoRender || features?.histogramColumnHeaders
								? HISTOGRAM_HEIGHT
								: 0) +
							(features?.autoRender || features?.statsColumnHeaders
								? STATS_HEIGHT
								: 0),
					},
				},
				styles,
			),
		[styles, features],
	)
}
