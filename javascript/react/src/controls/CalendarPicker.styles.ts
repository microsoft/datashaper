/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { FontIcon, Label, mergeStyles } from '@fluentui/react'

export const iconClass = mergeStyles({
	fontSize: 20,
	height: 25,
	width: 25,
	margin: '0 25px',
})

export const Container = styled.div`
	display: inline;
`

export const CalendarContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

export const CalendarButton = styled(FontIcon)`
	display: inline;
	float: left;
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 0px;
`

export const CalendarLabel = styled(Label)`
	display: inline;
	float: left;
	margin-left: 10px;
`
