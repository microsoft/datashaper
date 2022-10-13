/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const Aside = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
`

export const AsideHeader = styled.div`
	width: 100%;
	height: 36px;
	gap: 4px;
	display: flex;
	align-items: center;
	padding: 0 0 0 8px;
	background-color: ${({ theme }) => theme.palette.neutralQuaternaryAlt};
`

export const Title = styled.h3`
	width: 100%;
	font-size: 12px;
	color: ${({ theme }) => theme.palette.neutralSecondary};
	text-align: left;
	padding: 0;
	margin: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const WorkflowContainer = styled.div`
	height: 100%;
	width: 100%;
`
