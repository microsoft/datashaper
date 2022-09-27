/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

const GAP = 18
const INPUT_HEIGHT = 60

export const PageContainer = styled.div`
	height: calc(100vh - 80px);
	position: relative;
`
export const mgmtStyles = {
	root: {
		height: 36,
	},
}

export const Main = styled.div`
	display: flex;
	flex-flow: column;
	height: 100%;
	width: 100%;
	padding-top: 12px;
	gap: ${GAP}px;
	position: relative;
`

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: end;
	padding: 0px ${GAP}px;
`

export const DetailsListContainer = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

export const OutputContainer = styled.div`
	flex: 1 1 auto;
	display: flex;
	padding: 0px ${GAP}px;
	max-height: calc(100% - ${INPUT_HEIGHT + GAP * 4}px);
`

export const PrepareDataContainer = styled.div`
	height: 90%;
	overflow: hidden;
`

export const Container = styled.div<{ isCollapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ isCollapsed }) =>
		isCollapsed ? '100% 0' : 'calc(100% - 280px) 280px '};
`
