/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme } from '@fluentui/react'
import { Label } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`
export const FieldContainer = styled.div`
	display: flex;
	column-gap: 10px;
`

export const Code = styled.pre`
	margin: 0;
	padding: 4px;
	font-size: 11px;
	border: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralQuaternary};
`

export const ExampleContainer = styled.div``

export const ExampleLabel = styled(Label as any)`
	font-weight: normal;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`

export const ExampleDescription = styled.p`
	font-weight: normal;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
	font-size: 11px;
	margin: 0;
`
