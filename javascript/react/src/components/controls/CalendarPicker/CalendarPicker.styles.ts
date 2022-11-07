/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { FontIcon, Label, mergeStyles } from '@fluentui/react'

export const iconClass = mergeStyles({
	fontSize: 20,
	height: 20,
	width: 20,
})

export const Container = styled.div`
	display: inline;
`

export const CalendarContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const CalendarButton = styled(FontIcon)`
	display: inline;
	float: left;
	margin-left: 8px;
	margin-right: 4px;
`

export const CalendarLabel = styled(Label)`
	display: inline;
	float: left;
	margin-left: 8px;
	margin-right: 3px;
`
