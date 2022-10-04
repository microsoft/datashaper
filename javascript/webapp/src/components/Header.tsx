/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Container, Spacer, StyledFontIcon, Title } from './Header.styles.js'
import type { HeaderProps } from './Header.types.js'

export const Header: React.FC<HeaderProps> = memo(function Header({
	onSettingsClick,
}) {
	return (
		<Container>
			<Title>DataShaper</Title>
			<Spacer />
			<StyledFontIcon
				aria-label="Settings"
				iconName="Settings"
				onClick={onSettingsClick}
			/>
		</Container>
	)
})
