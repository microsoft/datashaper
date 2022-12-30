/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@fluentui/react'
import styled from 'styled-components'

const MODAL_WIDTH = 800
const MODAL_HEIGHT = 600
const HEADER_HEIGHT = 42
const FOOTER_HEIGHT = 52
const CONTENT_HEIGHT = MODAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - 10
const SIDEBAR_WIDTH = 240

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 5px 10px;
	background-color: ${({ theme }: { theme: Theme }) =>
		theme.palette.neutralLighter};
`

export const HeaderTitle = styled.span`
	display: flex;
	font-weight: bold;
	flex-direction: column;
	justify-content: center;
	color: ${({ theme }: { theme: Theme }) => theme.palette.neutralSecondary};
`

export const ModalBody = styled.div`
	display: flex;
	height: ${CONTENT_HEIGHT}
	width: ${MODAL_WIDTH}px;
	gap: 10px;
	padding: 10px;
`

export const Sidebar = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	width: ${SIDEBAR_WIDTH}px;
	max-width: ${SIDEBAR_WIDTH}px;
	min-width: ${SIDEBAR_WIDTH}px;
	height: ${CONTENT_HEIGHT}px;
	max-height: ${CONTENT_HEIGHT}px;
`

export const PreviewContent = styled.div`
	width: ${MODAL_WIDTH - SIDEBAR_WIDTH - 30}px;
	height: ${MODAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - 10}px;
	border: 1px solid
		${({ theme }: { theme: Theme }) => theme.palette.neutralLighter};
`

export const Footer = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	padding: 0 10px 10px 0;
`

export const modalStyles = {
	main: { width: MODAL_WIDTH, maxHeight: MODAL_HEIGHT, height: MODAL_HEIGHT },
}
