/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import styled from 'styled-components'

// always ensure the header is dark, regardless of mode
export const Container = styled.div`
	padding: 4px 16px 4px 16px;
	background: ${({ theme }) =>
		theme.isInverted
			? theme.palette.neutralQuaternary
			: theme.palette.neutralPrimary};
	border-bottom: 1px solid
		${({ theme }) =>
			theme.isInverted
				? theme.palette.neutralTertiary
				: theme.palette.neutralSecondary};
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	align-content: center;
`

export const Title = styled.h1`
	text-transform: uppercase;
	font-size: 25px;
	align-self: center;
	margin: 0;
	padding: 0;
	color: ${({ theme }) =>
		theme.isInverted
			? theme.palette.neutralSecondary
			: theme.palette.neutralTertiaryAlt};
	width: 70%;
`

export const StyledFontIcon = styled(FontIcon)`
	font-size: 20px;
	height: 20px;
	width: 20px;
	cursor: pointer;
	color: ${({ theme }) =>
		theme.isInverted ? theme.palette.neutralPrimary : theme.palette.white};
`

export const Spacer = styled.div`
	flex: 1;
`
