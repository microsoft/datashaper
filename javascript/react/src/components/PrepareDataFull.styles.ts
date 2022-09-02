/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'

const GAP = 18
const INPUT_HEIGHT = 60
const STEPS_HEIGHT = 280
const COLLAPSED_STEPS_HEIGHT = 50

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

export const Container = styled.div<{ isCollapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ isCollapsed }) =>
		isCollapsed ? 'calc(100% - 3.5rem) 3.5rem' : '75% 25%'};
`
export const Aside = styled.div<{ isCollapsed: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	overflow: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'hidden auto')};
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
`

export const Main = styled.div`
	display: flex;
	flex-flow: column;
	height: 100%;
	width: 100%;
	padding: ${GAP}px 0 ${GAP}px 0;
	gap: ${GAP}px;
	position: relative;
`

export const InputContainer = styled.div`
	display: flex;
	min-height: ${INPUT_HEIGHT}px;
	flex: 0 1 ${INPUT_HEIGHT}px;
	padding-right: ${GAP}px;
	order: 1;
`

export const OutputContainer = styled.div<{
	stepsPosition: string
}>`
	flex: 1 1 auto;
	display: flex;
	padding-right: ${GAP}px;
	max-height: calc(100% - ${INPUT_HEIGHT + STEPS_HEIGHT + GAP * 4}px);
	order: ${({ stepsPosition }) => (stepsPosition === 'bottom' ? 2 : 3)};
`

export const StepsTrayContainer = styled.div<{
	stepsPosition: string
	isCollapsed: boolean
}>`
	display: flex;
	min-height: ${({ isCollapsed }) =>
		isCollapsed ? 'unset' : STEPS_HEIGHT + 'px'};
	background-color: ${({ theme }) => theme.application().faint().hex()};
	padding: 0;
	order: ${({ stepsPosition }) => (stepsPosition === 'bottom' ? 3 : 2)};
	height: ${({ isCollapsed }) =>
		isCollapsed ? COLLAPSED_STEPS_HEIGHT + 'px' : 'auto'};
	overflow: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'auto hidden')};
	> div {
		display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'grid')};
	}
`
export const WorkflowContainer = styled.div<{ isCollapsed: boolean }>`
	height: 90%;
	width: 100%;
	position: relative;
	visibility: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'visible')};
`
