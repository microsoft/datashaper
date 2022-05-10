/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import styled from 'styled-components'

export const Content = styled.div``
export const Container = styled.div``

export const StyledSpinner = styled(Spinner)`
	margin-top: 20px;
`
export const SlidingContainer = styled.div<{ isOffset: boolean }>`
	transition-timing-function: ease;
	transition: 0.25s;
	position: absolute;
	width: 100%;
	border-left: ${({ isOffset, theme }) =>
		isOffset ? `1px solid ${theme.application().border()}` : '0'};
	left: ${({ isOffset }) => (isOffset ? '200px' : '0')};
`

export const FixedContainer = styled.div<{ isOpen: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex: 1;
	height: 100%;
	z-index: ${({ isOpen }) => (isOpen ? '1' : '-1')};
	transition-timing-function: ease;
	transition: 0.25s;
	opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`
