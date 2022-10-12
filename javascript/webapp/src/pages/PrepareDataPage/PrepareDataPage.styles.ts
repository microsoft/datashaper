/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const PageContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
`

export const PrepareDataContainer = styled.div`
	display: flex;
	height: 100%;
`

export const EditorContainer = styled.div<{ isCollapsed: boolean }>`
	display: grid;
	width: 100%;
	height: 100%;
	grid-template-columns: ${({ isCollapsed }) =>
		isCollapsed ? 'calc(100vw - 200px) 0' : 'calc(100vw - 480px) 280px'};
`

export const DetailsListContainer = styled.div`
	width: 100%;
	height: calc(100vh - 110px);
	border-right: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const DetailsListRowsContainer = styled.div`
	height: calc(100% - 18px);
	width: 100%;
`
