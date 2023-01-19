/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from '@essex/styled-components'
import type { IIconProps } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

const MAX_HEIGHT = 700

export const ContainerBody = styled.div`
	padding: 0;
	display: flex;
	justify-content: flex-start;
	gap: 12px;
`

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: ${({ theme }) => theme.palette.neutralLighter};
`

export const Title = styled.h3`
	padding-left: 12px;
	margin: 8px 0 8px 0;
`

export const HeaderButtons = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`

export const StepComponentContainer = styled.div`
	max-height: ${MAX_HEIGHT}px;
	overflow: hidden auto;
	width: 284px;
`

export const GuidanceContainer = styled.div`
	width: 400px;
	max-height: ${MAX_HEIGHT - 20}px;
	overflow: hidden auto;
`

export function useIconProps(): Record<string, IIconProps> {
	const theme = useTheme()
	return useMemo(
		() => ({
			cancel: {
				iconName: 'Cancel',
				styles: {
					root: {
						color: theme.palette.neutralPrimary,
					},
				},
			},
			help: {
				iconName: 'Help',
				styles: {
					root: {
						color: theme.palette.neutralPrimary,
						fontSize: 12,
					},
				},
			},
		}),
		[theme],
	)
}
