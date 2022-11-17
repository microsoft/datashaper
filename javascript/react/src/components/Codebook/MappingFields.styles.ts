/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { Label } from '@fluentui/react'

export const MappingContainer = styled.div`
	column-gap: 5px;
	display: flex;
`
export const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 5px;
`
export const FieldLabel = styled(Label)`
	padding-top: unset;
`
