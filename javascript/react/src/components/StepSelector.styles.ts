/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const Container = styled.div`
	width: 240px;
	display: flex;
	align-items: center;
`

export const SearchContainer = styled.div`
	border-bottom: 1px solid
		${({ theme }) => theme.application().lowContrast().hex()};
`

export const icons = {
	add: { iconName: 'Add' },
}
