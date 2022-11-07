/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
export { dropdownStyles, narrowDropdownStyles } from '../../styles.js'

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
	color: ${({ theme }) => theme.palette.neutralSecondary};
`

export const checkboxStyles = {
	root: {
		width: 220,
		paddingTop: '10px',
	},
}

/**
 * For very narrow side-by-sides with a delete button for example
 */
export const narrowerDropdownStyles = {
	root: {
		width: 99,
	},
}
