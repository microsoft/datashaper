/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { Label, TextField, Toggle } from '@fluentui/react'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`

export const TextValue = styled(TextField)`
	display: inline;
	width: 135px;
`

export const OrLabel = styled(Label)`
	display: inline;
	font-style: italic;
	padding-left: 10px;
	padding-right: 10px;
	border-left: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const FilterContainer = styled.div`
	margin-top: 8px;
	margin-left: 16px;
`

export const BooleanToggle = styled(Toggle)`
	margin-top: 5px;
`

export const InputLabel = styled.div`
	width: 68px;
`

export const Input = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`
