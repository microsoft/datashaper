/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITooltipHostStyles } from '@fluentui/react'
import { Icon } from '@fluentui/react'
import styled from 'styled-components'

export const HoverContainer = styled.div`
	width: 14px;
	text-align: right;
	display: flex;
	align-items: center;
`

export const LeftIcon = styled(Icon)`
	width: 14px;
	position: absolute;
	left: 8px;
`

export const RightIcon = styled(Icon)`
	width: 14px;
	position: absolute;
	right: 8px;
`

export const hostStyles: Partial<ITooltipHostStyles> = {
	root: { display: 'flex', alignItems: 'center' },
}
