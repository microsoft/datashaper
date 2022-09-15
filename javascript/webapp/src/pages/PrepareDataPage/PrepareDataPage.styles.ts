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

export const TextContainer = styled.div``

export const icons = {
	cancel: { iconName: 'Cancel' },
}

export const historyButtonStyles = { root: { width: '2rem' } }

export const SectionTitle = styled.span<{ isCollapsed?: boolean }>`
	margin: 0 ${GAP}px 0 ${GAP}px;
	font-weight: bold;
	writing-mode: vertical-rl;
	font-size: 15px;
	align-self: center;
	text-transform: uppercase;
	color: ${({ theme }) => theme.application().lowMidContrast().hex()};
	transform: ${({ isCollapsed }) =>
		isCollapsed ? 'translate(2rem, 0) rotate(-90deg)' : 'rotate(180deg)'};
	cursor: pointer;
	display: flex;
	gap: 0.5rem;
	align-items: center;
`

export const PrepareDataContainer = styled.div`
	height: 90%;
	overflow: hidden;
`

export const Container = styled.div<{ isCollapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ isCollapsed }) =>
		isCollapsed ? '100% 0' : '75% 25%'};
`
export const Aside = styled.div<{ isCollapsed: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	overflow: hidden;
	box-shadow: ${({ isCollapsed }) =>
		isCollapsed ? 'none' : '-1px 0px 10px 0px rgba(0,0,0,0.3)'};
`

export const AsideHeader = styled.div<{ isCollapsed: boolean }>`
	width: 100%;
	gap: ${({ isCollapsed }) => (isCollapsed ? 0 : '0.5rem')};
	display: flex;
	align-items: center;
	padding: 0.5rem 0 2rem;
	margin-left: ${({ isCollapsed }) => (isCollapsed ? '0' : '0.5rem')};
	border-bottom: ${({ theme, isCollapsed }) =>
		isCollapsed ? 'none' : `1px solid ${theme.application().border().hex()}`};
`

export const Title = styled.h4<{ isCollapsed: boolean }>`
	width: 100%;
	font-weight: 500;
	background-color: ${({ theme }) => theme.application().background().hex()};
	color: ${({ theme }) => theme.application().midContrast().hex()};
	font-size: 1.5rem;
	text-align: left;
	padding: 0;
	margin: 0;
	display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const WorkflowContainer = styled.div<{ isCollapsed: boolean }>`
	height: calc(100% - 75px);
	width: 100%;
	position: relative;
	visibility: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'visible')};
`
