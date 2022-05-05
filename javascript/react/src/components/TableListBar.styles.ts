/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const ListContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	gap: 18px;
`

export const viewButtonStyles = { root: { padding: '0 4px 0 6px' } }

export const icons = {
	view: { iconName: 'View' },
}
