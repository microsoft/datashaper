/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from '@essex/styled-components'
import type {
	IModalStyleProps,
	IModalStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

export const icons = {
	save: { iconName: 'CheckMark' },
	delete: { iconName: 'Delete' },
}

export const Container = styled.div`
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	overflow: auto;
	border: none;
	width: auto;
	// extra padding on left leaves room for "overhanging" delete buttons
	// while still allowing the primary content to remain centered
	padding-left: 32px;
`

export const Actions = styled.div`
	padding-right: 32px;
	margin-top: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	width: 100%;
`

export function useModalStyles(
	styles?: IStyleFunctionOrObject<IModalStyleProps, IModalStyles>,
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> {
	const theme = useTheme()
	return useMemo(
		() =>
			merge(
				{
					root: {
						border: `1px solid ${theme.palette.neutralLighter}`,
						width: 'fit-content',
						maxHeight: 580,
					},
				},
				styles,
			),
		[theme, styles],
	)
}
