/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from '@essex/styled-components'
import type { ITheme } from '@fluentui/react'
import { IconButton } from '@fluentui/react'

export const HeaderContainer = styled.div<{ groupLevel: number }>`
	padding-left: ${({ groupLevel }) => `${groupLevel * 12}px`};
	display: flex;
	gap: 8px;
	border-bottom: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralLight};
`

export const LevelButton = styled(IconButton as any)`
	width: 48px;
`

export const HeaderDetailsText = styled.span`
	align-self: center;
`

export const Bold = styled.b``
