/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { mergeStyles, mergeStyleSets } from '@fluentui/react'
import { ThemeVariant } from '@thematic/core'
import styled from 'styled-components'

// always ensure the header is dark, regardless of mode
export const Container = styled.div`
	padding: 4px 16px 4px 16px;
	background: ${({ theme }) =>
		theme.variant === ThemeVariant.Light
			? theme.application().highContrast()
			: theme.application().lowContrast()};
	border-bottom: 1px solid
		${({ theme }) =>
			theme.variant === ThemeVariant.Light
				? theme.application().midHighContrast()
				: theme.application().lowMidContrast()};
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
		theme.variant === ThemeVariant.Light
			? theme.application().lowContrast()
			: theme.application().midHighContrast()};
	width: 70%;
`

export const iconClass = mergeStyles({
	fontSize: 20,
	height: 20,
	width: 20,
	cursor: 'pointer',
})

export const classNames = mergeStyleSets({
	white: [{ color: 'white', marginRight: 5 }, iconClass],
})

export const Spacer = styled.div`
	flex: 1;
`
