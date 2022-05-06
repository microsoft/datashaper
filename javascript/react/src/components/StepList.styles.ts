/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const addButtonStyles = {
	root: { padding: '0 4px 0 6px', whiteSpace: 'nowrap' },
}

export const icons = {
	add: { iconName: 'Add' },
}

export const Container = styled.div`
	display: flex;
	overflow: auto;
	column-gap: 12px;
`

export const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 18px;
`
