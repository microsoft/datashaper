/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'

import { NavPanel } from '~components/NavPanel'

import { classNames,HamburgerMenu, NavBarContainer } from './NavBar.styles.js'

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
