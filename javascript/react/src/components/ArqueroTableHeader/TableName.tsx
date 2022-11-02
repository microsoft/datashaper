/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { memo } from 'react'

import type { TableNameProps } from './TableName.types.js'

/**
 * Renders the table name if passed, or the option to rename the name if the function
 * onRenameTable is passed to be called when clicking save or pressing enter on the callout
 */
export const TableName: React.FC<TableNameProps> = memo(function TableName({
	name,
	color,
}) {
	return (
		<Container>
			<H3 color={color}>{name}</H3>
		</Container>
	)
})

const H3 = styled.h3<{ color?: string }>`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme, color }) => color || theme.palette.white};
`
const Container = styled.div``
