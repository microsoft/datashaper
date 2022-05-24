/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.div`
	width: 600px;
	height: 400px;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

export const TableContainer = styled.div`
	height: 364px;
`
