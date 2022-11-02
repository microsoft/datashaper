/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`

export const Vertical = styled.div<{ index: number }>`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: ${({ index }) => (index > 0 ? 6 : 0)}px;
`
