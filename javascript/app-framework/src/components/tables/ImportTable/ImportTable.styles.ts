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
const PADDING = 12
const CONTENT_HEIGHT = MODAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - 12
const SIDEBAR_WIDTH = 240
const TABLE_HEIGHT = 280

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
	gap: ${PADDING * 2}px;
	padding: ${PADDING}px;
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
	overflow-y: auto;
`

export const MainContent = styled.div`
	display: flex;
	flex-direction: column;
	width: ${MODAL_WIDTH - SIDEBAR_WIDTH - PADDING * 4}px;
`

export const PreviewContent = styled.div`
	height: ${TABLE_HEIGHT}px;
	border: 1px solid
		${({ theme }: { theme: Theme }) => theme.palette.neutralLighter};
`

export const Footer = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: ${PADDING * 2}px;
	padding: 0 ${PADDING}px ${PADDING}px 0;
`

export const textFieldStyles = {
	field: {
		height: TABLE_HEIGHT / 2,
		maxHeight: TABLE_HEIGHT / 2,
	},
}

export const modalStyles = {
	main: { width: MODAL_WIDTH, maxHeight: MODAL_HEIGHT, height: MODAL_HEIGHT },
}
