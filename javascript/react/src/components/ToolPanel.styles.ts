/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const Container = styled.div`
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
`

export const Header = styled.div`
	width: 100%;
	height: 36px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 0 0 8px;
	background-color: ${({ theme }) => theme.palette.neutralQuaternaryAlt};
`

export const TitleContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`

export const Title = styled.h3`
	width: 100%;
	font-size: 12px;
	color: ${({ theme }) => theme.palette.neutralSecondary};
	text-align: left;
	padding: 0;
	margin: 0;
`

export const Content = styled.div`
	height: 100%;
	width: 100%;
	overflow-y: auto;
`
