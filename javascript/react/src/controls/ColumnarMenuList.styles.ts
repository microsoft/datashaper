/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const itemProps = {
	styles: {
		root: {
			paddingLeft: 8,
			height: 28,
			lineHeight: 28,
		},
		item: {
			listStyleType: 'none',
		},
	},
}

export const MenuLayout = styled.div`
	display: flex;
	padding: 8px 0 8px 0;
	gap: 12px;
`

export const Column = styled.div`
	min-width: 120px;
`

export const ColumnHeader = styled.div`
	padding: 0 12px 0 12px;
	margin-bottom: 8px;
	font-weight: bold;
	color: ${({ theme }) => theme.application().accent().hex()};
`
