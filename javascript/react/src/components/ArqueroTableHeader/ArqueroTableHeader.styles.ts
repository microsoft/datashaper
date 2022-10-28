/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from '@essex/styled-components'

import { DEFAULT_HEIGHT } from './ArqueroTableHeader.constants.js'

export const Container = styled.div<{ background: string; color: string }>`
	height: ${DEFAULT_HEIGHT}px;
	width: 100%;
	background-color: ${({ background }) => background};
	color: ${({ color }) => color};
	display: flex;
	align-items: center;
	justify-content: space-between;
`

export const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
`

export const Left = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-start;
`

export const Middle = styled.div<{ hasFarCommandBar: boolean }>`
	flex: 2;
	display: flex;
	justify-content: ${({ hasFarCommandBar }) =>
		hasFarCommandBar ? 'center' : 'end'};
	align-items: center;
	padding: 0 8px;
	gap: 8px;
`
export const Right = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-end;
`
