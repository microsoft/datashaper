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
	background-color: ${({ theme }) => theme.palette.white};
	color: ${({ theme }) => theme.palette.neutralTertiary};
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
	border: 1px solid ${({ theme }) => theme.palette.neutralLighter};
`

export const Container = styled.div<{ isCollapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ isCollapsed }) =>
		isCollapsed ? '100% 0' : '70% 30%'};
`
