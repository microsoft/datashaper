/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
`

// bundles the label and sort list for tight spacing
export const SortsContainer = styled.div``

// bundles the individual sorts 
export const Sorts = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

export const icons = {
	add: { iconName: 'Add' },
}
