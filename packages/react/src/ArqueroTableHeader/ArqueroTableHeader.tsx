/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CommandBar } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { TableName } from './TableName'
import { useColumnCounts, useCommands } from './hooks'
import { ArqueroTableHeaderProps } from '.'

const HEIGHT = 36

export const ArqueroTableHeader: React.FC<ArqueroTableHeaderProps> = memo(
	function ArqueroTableHeader({
		table,
		name,
		showRowCount = true,
		showColumnCount = true,
		commands,
		visibleColumns,
		onRenameTable,
	}) {
		const commandItems = useCommands(commands)

		const groupCount = useMemo((): any => {
			return table.isGrouped() ? table.groups().size : 0
		}, [table])

		// TODO: we can do the same thing for rows when a filter is applied
		const columnCounts = useColumnCounts(table, visibleColumns)
		return (
			<Header>
				<TableName onRenameTable={onRenameTable} name={name} />
				{showRowCount === true ? <H3>{table.numRows()} rows</H3> : null}
				{showColumnCount === true ? (
					<H3>
						{columnCounts.total} cols{' '}
						{columnCounts.hidden > 0 ? `(${columnCounts.hidden} hidden)` : ''}
					</H3>
				) : null}
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

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme }) => theme.application().background().hex()};
`
