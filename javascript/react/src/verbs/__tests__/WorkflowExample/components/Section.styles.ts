/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.section`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin-bottom: 40px;
`

export const Titles = styled.div`
	width: 140px;
	min-width: 140px;
	text-align: right;
	text-transform: uppercase;
`

export const H1 = styled.h1`
	margin-top: 0;
	margin-bottom: 0;
	color: ${({ theme }) => theme.application().lowContrast().hex()};
`

export const H2 = styled.h2`
	margin-top: 0;
	margin-bottom: 0;
	color: ${({ theme }) => theme.application().accent().hex()};
`

export const StyledSeparator = styled(Separator)`
	margin-left: 8px;
	margin-right: 36px;
`

export const ChildrenContainer = styled.div`
	display: flex;
	justify-content: space-between;
`
