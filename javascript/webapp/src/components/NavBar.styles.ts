/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FontIcon, mergeStyles, mergeStyleSets } from '@fluentui/react'
import styled from 'styled-components'

export const iconClass = mergeStyles({
	fontSize: 30,
	height: 30,
	width: 30,
	cursor: 'pointer',
})

export const classNames = mergeStyleSets({
	white: [{ color: 'white' }, iconClass],
})

export const NavBarContainer = styled.div``

export const HamburgerMenu = styled(FontIcon)`
	float: right;
`
