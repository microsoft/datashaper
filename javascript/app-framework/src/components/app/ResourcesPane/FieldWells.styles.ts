/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDropdownProps } from '@essex/components'
import type { IDropdownProps } from '@fluentui/react'
import { Icon } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
    padding-bottom: 4px;
`

export const FieldContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 0 8px 0 32px;
`

export const StyledIcon = styled(Icon)`
	color: ${({ theme }) => theme.palette.neutralPrimary};
`

export const Title = styled.div`
	font-size: 0.75em;
	color: ${({ theme }) => theme.palette.neutralSecondary};
`

export const Well = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 4px;
	color: ${({ theme }) => theme.palette.neutralSecondary};
	border: 1px dotted ${({ theme }) => theme.palette.neutralTertiaryAlt};
	background: ${({ theme }) => theme.palette.neutralLighter};
	border-radius: 4px;
	padding: 2px 8px;
`

const staticDropdownStyles = {
	styles: {
		root: {
			width: '100%',
			border: 'none',
		},
		dropdown: {
			border: 'none',
		},
		title: {
			background: 'none',
		},
	},
}

export function useFieldDropdownProps(): Partial<IDropdownProps> {
	return useDropdownProps(staticDropdownStyles, 'small')
}
