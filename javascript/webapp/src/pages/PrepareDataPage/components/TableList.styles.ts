/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const ListContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 200px;
	min-width: 200px;
	height: 100%;
	gap: 24px;
	border-right: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`
