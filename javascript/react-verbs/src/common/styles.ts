/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const LeftAlignedRow = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-end;
	margin-bottom: 8px;
`

/**
 * For explanatory text below an input,
 */
export const InputExplainer = styled.div`
	font-size: 0.85em;
	color: ${({ theme }) => theme.application().midHighContrast().hex()};
`
