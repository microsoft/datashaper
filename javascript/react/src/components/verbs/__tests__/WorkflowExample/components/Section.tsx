/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import {
	ChildrenContainer,
	Container,
	H1,
	H2,
	StyledSeparator,
	Titles,
} from './Section.styles.js'
import type { SectionProps } from './Section.types.js'

export const Section: React.FC<React.PropsWithChildren<SectionProps>> = memo(
	function Section({ title, subtitle, children }) {
		return (
			<Container className='section'>
				<Titles>
					<H1>{title}</H1>
					<H2>{subtitle}</H2>
				</Titles>
				<StyledSeparator vertical />
				<ChildrenContainer>{children}</ChildrenContainer>
			</Container>
		)
	},
)
