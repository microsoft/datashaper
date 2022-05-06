/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Selector = styled.div`
	display: flex;
	justify-content: space-around;
`
export const Link = styled.a`
	cursor: pointer;
`
export const Sep = styled.div`
	margin-left: 4px;
	margin-right: 4px;
	color: ${({ theme }) => theme.application().lowContrast().hex()};
`
