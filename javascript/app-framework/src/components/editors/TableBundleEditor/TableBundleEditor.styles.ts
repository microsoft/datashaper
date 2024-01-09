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
	height: calc(100% - 44px);
	border-right: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralLighter};
`

export const Container = styled.div<{ expanded: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ expanded }) =>
		expanded ? 'calc(100% - 284px) 284px' : '100% 0'};
`
