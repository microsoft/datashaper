/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const icons = {
	cancel: { iconName: 'Cancel' },
}

export const Aside = styled.div<{ isCollapsed: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	overflow: hidden;
	box-shadow: ${({ isCollapsed, theme }) =>
		isCollapsed
			? 'none'
			: `-1px 0px 10px 0px ${theme.application().lowMidContrast().hex()}`};
`

export const AsideHeader = styled.div<{ isCollapsed: boolean }>`
	width: 100%;
	gap: ${({ isCollapsed }) => (isCollapsed ? 0 : '0.5rem')};
	display: flex;
	align-items: center;
	padding: 0.5rem 0;
	margin-left: ${({ isCollapsed }) => (isCollapsed ? '0' : '0.5rem')};
`

export const Title = styled.span<{ isCollapsed: boolean }>`
	width: 100%;
	font-weight: 500;
	background-color: ${({ theme }) => theme.application().background().hex()};
	color: ${({ theme }) => theme.application().midContrast().hex()};
	font-size: 1.2rem;
	text-align: left;
	padding: 0;
	margin: 0;
	display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const WorkflowContainer = styled.div<{ isCollapsed: boolean }>`
	height: 100%;
	width: 100%;
	position: relative;
	visibility: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'visible')};
`

export const DetailsListContainer = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

export const Container = styled.div<{ isCollapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ isCollapsed }) =>
		isCollapsed ? '100% 0' : '70% 30%'};
`
