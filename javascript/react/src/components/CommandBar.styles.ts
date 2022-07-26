/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const CommandBarWrapper = styled.div<{
	height?: string
	bgColor: string
	color: string
}>`
	background-color: ${({ bgColor }) => bgColor};
	color: ${({ color }) => color || 'inherit'};
	width: 100%;
`
