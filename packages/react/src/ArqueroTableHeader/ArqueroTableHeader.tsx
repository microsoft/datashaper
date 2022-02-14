/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useDimensions } from '@essex-js-toolkit/hooks'
import { memo, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { CommandBar } from './CommandBar'
import { TableName } from './TableName'
import { HEIGHT } from './constants'
import { useColumnCounts, useCommands } from './hooks'
import { ArqueroTableHeaderProps } from '.'

export const ArqueroTableHeader: React.FC<ArqueroTableHeaderProps> = memo(
	function ArqueroTableHeader({
		table,
		name,
		showRowCount = true,
		showColumnCount = true,
		commands,
		farCommands,
		visibleColumns,
		onRenameTable,
	}) {
		const ref = useRef(null)
		const { width } = useDimensions(ref) || { width: 0 }
		const commandItems = useCommands(commands)
		const farCommandItems = useCommands(farCommands)
		const groupCount = useMemo((): any => {
			return table.isGrouped() ? table.groups().size : 0
		}, [table])

		// TODO: we can do the same thing for rows when a filter is applied
		const columnCounts = useColumnCounts(table, visibleColumns)
		return (
			<Header ref={ref}>
				{commandItems.length > 0 ? (
					<CommandBar commands={commandItems} />
				) : null}
				<Metadata>
					{name ? (
						<TableName onRenameTable={onRenameTable} name={name} />
					) : null}
					{showRowCount === true ? <H3>{table.numRows()} rows</H3> : null}
					{showColumnCount === true ? (
						<H3>
							{columnCounts.total} cols{' '}
							{columnCounts.hidden > 0 ? `(${columnCounts.hidden} hidden)` : ''}
						</H3>
					) : null}
					{groupCount ? <H3>{groupCount} groups</H3> : null}
				</Metadata>
				{farCommandItems.length > 0 ? (
					// Best way to have a command bar in the far right
					// that handles overflow in case there are too many commands
					// If the bar is too wide, then only use 10% of it for the commands
					<CommandBar
						commands={farCommandItems}
						width={width >= 992 ? '10%' : undefined}
					/>
				) : null}
			</Header>
		)
	},
)

const Header = styled.div`
	height: ${HEIGHT}px;
	width: 100%;
	background-color: ${({ theme }) => theme.application().accent().hex()};
	position: relative;
	padding: 0 5px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin: 0 8px 0 0;
	color: ${({ theme }) => theme.application().background().hex()};
`

const Metadata = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0 1rem;
`
