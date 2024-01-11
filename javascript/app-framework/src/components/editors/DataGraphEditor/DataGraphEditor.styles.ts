/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div<{ expanded: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ expanded }) =>
		expanded ? 'calc(100% - 280px) 280px' : '100% 0'};
`

export const MainContainer = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	border-right: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralLighter};
`

export const Header = styled.div`
	width: 100%;
`

export const GraphContainer = styled.div`
	width: 100%;
	height: calc(100% - 80px);
`

export const ConfigContainer = styled.div`
`