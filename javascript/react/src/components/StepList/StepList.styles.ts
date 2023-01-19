/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CollapsiblePanelStyles } from '@essex/components'
import styled from '@essex/styled-components'
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export const buttonStyles = { width: 100 }

export const icons = {
	preview: { iconName: 'View' },
	add: { iconName: 'Add' },
	chevronRight: { iconName: 'ChevronRight' },
	chevronDown: { iconName: 'ChevronDown' },
	info: { iconName: 'Info' },
}

export const Container = styled.div`
	width: 100%;
	height: 100%;
`

export const ButtonContainer = styled.div`
	padding: 8px;
	display: flex;
	justify-content: space-around;
	border-bottom: 1px solid ${({ theme }) => theme.palette.neutralQuaternaryAlt};
`

export const StepsContainer = styled.div``

export function useCollapsiblePanelStyles(): CollapsiblePanelStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			header: {
				background: theme.palette.white,
				color: theme.palette.neutralPrimary,
				padding: '4px 0',
				borderBottom: 'none',
				borderTop: 'none',
			},
			content: {
				border: 'none',
				borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
			},
		}),
		[theme],
	)
}
