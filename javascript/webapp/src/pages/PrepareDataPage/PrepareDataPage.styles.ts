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

export const EditorContainer = styled.div<{ isOpen: boolean }>`
	display: grid;
	width: 100%;
	height: 100%;
	grid-template-columns: ${({ isOpen }) =>
		isOpen ? 'calc(100vw - 480px) 280px' : 'calc(100vw - 200px) 0'};
`

export const DetailsListContainer = styled.div`
	width: 100%;
	height: calc(100vh - 110px);
`

export const DetailsListRowsContainer = styled.div`
	height: calc(100% - 18px);
	width: 100%;
`

export const StepsListContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100vh - 110px);
	width: 100%;
	border-left: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
	border-top: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`
