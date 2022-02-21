/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FontIcon, mergeStyles, mergeStyleSets } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'
import styled from 'styled-components'
import { NavPanel } from '~components/NavPanel'

export const NavBar = memo(function NavBar() {
	const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
		useBoolean(false)

	return (
		<NavBarContainer>
			<HamburgerMenu
				aria-label="CollapseMenu"
				iconName="CollapseMenu"
				className={classNames.white}
				onClick={openPanel}
			/>
			<NavPanel isOpen={isOpen} onDismiss={dismissPanel}></NavPanel>
		</NavBarContainer>
	)
})

const iconClass = mergeStyles({
	fontSize: 30,
	height: 30,
	width: 30,
	cursor: 'pointer',
})

const classNames = mergeStyleSets({
	white: [{ color: 'white' }, iconClass],
})

const NavBarContainer = styled.div`
	width: 5%;
	margin-right: 10px;
`
const HamburgerMenu = styled(FontIcon)`
	float: right;
`
