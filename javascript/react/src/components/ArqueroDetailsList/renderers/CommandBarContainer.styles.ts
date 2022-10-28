/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-top: 1px solid ${({ theme }) => theme.palette.neutralLighter};
	border-bottom: 1px solid ${({ theme }) => theme.palette.neutralLighter};
`
