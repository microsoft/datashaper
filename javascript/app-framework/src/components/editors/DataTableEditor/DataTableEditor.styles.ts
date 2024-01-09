/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme } from '@fluentui/react'
import styled from 'styled-components'

export const DetailsListContainer = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	border-right: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralLighter};
`

// TODO: this logic is repeated in each editor
export const Container = styled.div<{ expanded: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ expanded }) =>
		expanded ? 'calc(100% - 280px) 280px' : '100% 0'};
`

export const ConfigContainer = styled.div`
	padding: 10px;
`
