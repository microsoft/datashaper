/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

export const Container = styled.div`
	display: flex;
	align-items: center;
	height: 100%;
	width: inherit;
	> * {
		&:first-child {
			padding: 0px 8px 0px 0;
		}
	}
`
