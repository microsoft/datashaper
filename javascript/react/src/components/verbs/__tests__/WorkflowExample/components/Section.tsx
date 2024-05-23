/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'

import {
	ChildrenContainer,
	Container,
	H1,
	H2,
	H3,
	StyledSeparator,
	Titles,
} from './Section.styles.js'
import type { SectionProps } from './Section.types.js'

export const Section: React.FC<React.PropsWithChildren<SectionProps>> = memo(
	function Section({ title, subtitle, children }) {
		const subtitleParts = useMemo(
			() => subtitle?.split('.') || [subtitle],
			[subtitle],
		)
		return (
			<Container className='section'>
				<Titles>
					<H1>{title}</H1>
					<H2>{subtitleParts[0]}</H2>
					{subtitleParts.slice(1).map((part, i) => (
						<H3 key={`sub-${part}-${i}`}>{part}</H3>
					))}
				</Titles>
				<StyledSeparator vertical />
				<ChildrenContainer>{children}</ChildrenContainer>
			</Container>
		)
	},
)
