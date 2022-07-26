/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const Container = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

export const TextContainer = styled.div`
	display: flex;
	height: 100%;
	align-items: center;
`
