import styled from 'styled-components'

import { IconButton } from '@fluentui/react'

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
