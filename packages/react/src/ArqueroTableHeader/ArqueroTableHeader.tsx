/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CommandBar } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useCommands } from './hooks'
import { ArqueroTableHeaderProps } from '.'

const HEIGHT = 36

export const ArqueroTableHeader: React.FC<ArqueroTableHeaderProps> = memo(
	function ArqueroTableHeader({
		table,
		name,
		showRowCount = true,
		showColumnCount = true,
		commands,
	}) {
		const commandItems = useCommands(commands)

		const groupCount = useMemo((): any => {
			return table.isGrouped() ? table.groups().size : 0
		}, [table])

		return (
			<Header>
				{name ? <H2>{name}</H2> : null}
				{showRowCount === true ? <H3>{table.numRows()} rows</H3> : null}
				{showColumnCount === true ? <H3>{table.numCols()} cols</H3> : null}
				{groupCount ? <H3>{groupCount} groups</H3> : null}
				{commandItems.length > 0 ? (
					<CommandBar items={commandItems} styles={commandStyles} />
				) : null}
			</Header>
		)
	},
)

const commandStyles = {
	root: {
		height: HEIGHT,
		background: 'none',
		padding: 0,
	},
}

const Header = styled.div`
	height: ${HEIGHT}px;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: ${({ theme }) => theme.application().accent().hex()};
`

const H2 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme }) => theme.application().background().hex()};
`

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme }) => theme.application().background().hex()};
`
