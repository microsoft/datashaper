/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import { memo } from 'react'

import {
	classNames,
	Container,
	Spacer,
	Subtitle,
	Title,
} from './Header.styles.js'
import type { HeaderProps } from './Header.types.js'

export const Header: React.FC<HeaderProps> = memo(function Header({
	onMenuClick,
	onSettingsClick,
}) {
	return (
		<Container>
			<FontIcon
				aria-label="Menu"
				iconName="CollapseMenu"
				className={classNames.white}
				onClick={onMenuClick}
			/>
			<Title>Data Wrangling Components</Title>
			<Subtitle>pipeline builder</Subtitle>
			<Spacer />
			<FontIcon
				aria-label="Settings"
				iconName="Settings"
				className={classNames.white}
				onClick={onSettingsClick}
			/>
		</Container>
	)
})
