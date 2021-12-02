/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

export interface SectionProps {
	title: string
	subtitle?: string
	type?: string
}

export const Section: React.FC<SectionProps> = memo(function Section({
	title,
	subtitle,
	type,
	children,
}) {
	return (
		<Container className="section">
			<Titles>
				<H1>{title}</H1>
				<H2>{subtitle}</H2>
				<H3>{type}</H3>
			</Titles>
			<StyledSeparator vertical />
			<ChildrenContainer>{children}</ChildrenContainer>
		</Container>
	)
})

const Container = styled.section`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin-bottom: 40px;
`

const Titles = styled.div`
	width: 200px;
	text-align: right;
	text-transform: uppercase;
`

const H1 = styled.h1`
	margin-top: 0;
	margin-bottom: 0;
	color: ${({ theme }) => theme.application().lowContrast().hex()};
`

const H2 = styled.h2`
	margin-top: 0;
	margin-bottom: 0;
	color: ${({ theme }) => theme.application().accent().hex()};
`

const H3 = styled.h3`
	margin-top: 0;
	color: ${({ theme }) => theme.application().faint().hex()};
`

const StyledSeparator = styled(Separator)`
	margin-left: 8px;
	margin-right: 36px;
`

const ChildrenContainer = styled.div`
	display: flex;
	justify-content: space-between;
`
