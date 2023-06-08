/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Container, Title } from './Header.styles.js'
import type { HeaderProps } from './Header.types.js'

export const Header: React.FC<HeaderProps> = memo(function Header() {
	return (
		<Container>
			<Title>DataShaper</Title>
		</Container>
	)
})
