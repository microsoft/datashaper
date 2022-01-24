/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsListStyles } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { merge } from 'lodash'
import { useMemo } from 'react'
import { DetailsListFeatures } from '..'

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
					headerWrapper: {
						position: isHeadersFixed ? 'sticky' : 'inherit',
						zIndex: '2',
						top: '0',
						background: theme.application().background().hex(),
						borderBottom:
							!features?.smartHeaders &&
							!features?.histogramColumnHeaders &&
							!features?.statsColumnHeaders
								? `1px solid ${theme.application().faint().hex()}`
								: 'unset',
						selectors: {
							'.ms-DetailsHeader': {
								height: 'auto',
								borderBottom:
									!features?.smartHeaders &&
									!features?.histogramColumnHeaders &&
									!features?.statsColumnHeaders
										? `1px solid ${theme.application().faint().hex()}`
										: 'unset',
							},
							'.ms-DetailsHeader-cell': {
								height: 'auto',
								padding: 'unset',
							},
						},
					},
				},
				styles,
			),
		[theme, styles, features, isHeadersFixed],
	)
}
