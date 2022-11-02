/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { Label } from '@fluentui/react'

export const Container = styled.div`
	margin-top: 8px;
	margin-left: 16px;
`

export const Input = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

export const InputLabel = styled.div`
	width: 84px;
`

export const OrLabel = styled(Label)`
	display: inline;
	font-style: italic;
	padding-left: 10px;
	padding-right: 10px;
	border-left: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const spinStyles = {
	root: {
		width: 120,
	},
}
