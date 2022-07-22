/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const LeftAlignedRow = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-end;
`

/**
 * For explanatory text below an input,
 */
export const InputExplainer = styled.div`
	font-size: 0.85em;
	color: ${({ theme }) => theme.application().midHighContrast().hex()};
`

export const dropdownStyles = {
	root: {
		width: 220,
	},
}

/**
 * For side-by-side dropdowns with a 12px gap
 */
export const narrowDropdownStyles = {
	root: {
		width: 135,
	},
}
