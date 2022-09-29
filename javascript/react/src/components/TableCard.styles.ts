/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { DocumentCard, Icon } from '@fluentui/react'

export const styles = {
	title: { root: { padding: '1px 5px', height: 'min-content' } },
}

export const icons = {
	preview: { iconName: 'View' },
}

export const PreviewIcon = styled(Icon)`
	color: ${({ theme }) => theme.palette.themePrimary};
	align-self: center;
`

export const Card = styled(DocumentCard)<{ isSelected: boolean }>`
	margin-top: unset !important;
	display: flex;
	justify-content: space-between;
	padding: 4px 8px 4px 4px;
	border: 1px solid
		${({ theme, isSelected }) =>
			isSelected ? theme.palette.neutralTertiary : theme.palette.neutralLight};
	font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
`
