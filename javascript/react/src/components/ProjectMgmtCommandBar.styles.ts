/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@thematic/core'
import { ThemeVariant } from '@thematic/core'
import styled from 'styled-components'

export const background = (theme: Theme): string =>
	theme.variant === ThemeVariant.Light
		? theme.application().highContrast().hex()
		: theme.application().lowContrast().hex()

export const color = (theme: Theme): string =>
	theme.variant === ThemeVariant.Light
		? theme.application().lowContrast().hex()
		: theme.application().midHighContrast().hex()

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
	color: ${({ theme }) => color(theme)};
`
