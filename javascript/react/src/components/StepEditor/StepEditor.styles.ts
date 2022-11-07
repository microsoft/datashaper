/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from '@essex/styled-components'

export const icons = {
	save: { iconName: 'CheckMark' },
	delete: { iconName: 'Delete' },
}

export const Container = styled.div`
	position: relative;
`
export const Actions = styled.div`
	margin-top: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	width: 100%;
`
