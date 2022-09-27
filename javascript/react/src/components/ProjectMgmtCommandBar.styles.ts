/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme } from '@fluentui/react'
import styled from 'styled-components'

export const background = (theme: ITheme): string =>
	theme.isInverted
		? theme.palette.neutralQuaternary
		: theme.palette.neutralPrimary

export const border = (theme: ITheme): string =>
	theme.isInverted
		? theme.palette.neutralTertiaryAlt
		: theme.palette.neutralPrimary

export const color = (theme: ITheme): string =>
	theme.isInverted
		? theme.palette.neutralSecondary
		: theme.palette.neutralTertiaryAlt

export const dropzone = {
	container: {
		height: 'auto',
		borderStyle: 'none',
		margin: 0,
	},
}

export const Wrapper = styled.div`
	width: 100%;
	background: ${({ theme }) => background(theme)};
	border-bottom: 1px solid ${({ theme }) => border(theme)};
	color: ${({ theme }) => color(theme)};
`
