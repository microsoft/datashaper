/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const WarningContainer = styled.div`
	width: 10px;
`

export const Warning = styled.div`
	width: 0;
	height: 0;
	position: absolute;
	top: 0;
	left: -3px;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-bottom: 6px solid ${({ theme }) => theme.application().warning().hex()};
	transform: rotate(-45deg);
`
