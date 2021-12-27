/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsListStyles } from '@fluentui/react'
import { merge } from 'lodash'
import { useMemo } from 'react'

// this is the default built into fluent
const DEFAULT_HEADER_HEIGHT = 60
// add this for histograms
const AUTO_RENDER_HEIGHT = 28
/**
 * Create a DetailsHeader style with enough height to handle the options we've turned on.
 * Each one requires a small amount of vertical space that stacks up.
 * @param options
 * @returns
 */
export function useDetailsListStyles(
	options: { autoRender?: boolean },
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
							(options.autoRender ? AUTO_RENDER_HEIGHT : 0),
					},
				},
				styles,
			),
		[styles, options],
	)
}
