/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	justify-content: space-between;

	&:has(.hoverIcon):hover .hoverIcon {
		visibility: visible;
	}
`

export const HoverIcon = styled(Icon)`
	visibility: hidden;
	font-size: 18px;
	transform: rotate(90deg);
`
