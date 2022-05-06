/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import styled from 'styled-components'

export const HeaderContainer = styled.div<{ groupLevel: number }>`
	padding-left: ${({ groupLevel }) => `${groupLevel * 12}px`};
	display: flex;
	gap: 8px;
`

export const LevelButton = styled(IconButton as any)`
	width: 5%;
`

export const HeaderDetailsText = styled.span`
	align-self: center;
`

export const Bold = styled.b``
