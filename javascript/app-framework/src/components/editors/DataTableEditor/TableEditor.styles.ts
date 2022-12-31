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

export const Container = styled.div<{ collapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ collapsed }) =>
		collapsed ? '100% 0' : 'calc(100% - 280px) 280px '};
`
