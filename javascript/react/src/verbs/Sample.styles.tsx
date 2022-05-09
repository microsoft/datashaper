/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

export const Or = styled.div`
	margin-left: 8px;
	margin-right: 8px;
	height: 100%;
	display: flex;
	align-items: center;
	color: ${({ theme }) => theme.application().midContrast().hex()};
`

export const spinStyles = {
	root: {
		width: 120,
	},
}
