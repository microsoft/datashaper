/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`

export const SideBySide = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
`

/**
 * For side-by-side dropdowns with a 12px gap
 */
export const narrowDropdownStyles = {
	root: {
		width: 135,
	},
}

export const leftStyles = {
	root: {
		...narrowDropdownStyles.root,
		marginRight: 12,
	},
}
