/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useDimensions } from '@essex/hooks'
import { memo, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { CommandBar } from './CommandBar.js'
import { HEIGHT } from './constants.js'
import { useColumnCounts, useCommands, useRowCounts } from './hooks/index.js'
import type { ArqueroTableHeaderProps } from './index.js'
import { TableName } from './TableName.js'

export const ArqueroTableHeader: React.FC<ArqueroTableHeaderProps> = memo(
	function ArqueroTableHeader({
		table,
		name,
		showRowCount = true,
		showColumnCount = true,
		commands,
		farCommands,
		visibleColumns,
		visibleRows,
		onRenameTable,
		style,
	}) {
		const ref = useRef(null)
		const { width } = useDimensions(ref) || { width: 0 }
		const { bgColor, textColor } = style || {}
		const commandItems = useCommands(commands, bgColor, textColor)
		const farCommandItems = useCommands(farCommands, bgColor, textColor)
		const groupCount = useMemo((): any => {
			return table.isGrouped() ? table.groups().size : 0
		}, [table])

		// TODO: we can do the same thing for rows when a filter is applied
		const columnCounts = useColumnCounts(table, visibleColumns)
		const rowCounts = useRowCounts(table, visibleRows)
		return (
			<Header bgColor={bgColor} ref={ref}>
				{commandItems.length > 0 ? (
					<CommandBar
						commands={commandItems}
						bgColor={bgColor}
						color={textColor}
					/>
				) : null}
				<Metadata>
					{name ? (
						<TableName
							onRenameTable={onRenameTable}
							name={name}
							color={textColor}
						/>
					) : null}
					{showRowCount === true ? (
						<H3 color={textColor}>
							{rowCounts.total} rows{' '}
							{rowCounts.hidden > 0 ? `(${rowCounts.hidden} hidden)` : ''}
						</H3>
					) : null}
					{showColumnCount === true ? (
						<H3 color={textColor}>
							{columnCounts.total} cols{' '}
							{columnCounts.hidden > 0 ? `(${columnCounts.hidden} hidden)` : ''}
						</H3>
					) : null}
					{groupCount ? <H3 color={textColor}>{groupCount} groups</H3> : null}
				</Metadata>
				{farCommandItems.length > 0 ? (
					// Best way to have a command bar in the far right
					// that handles overflow in case there are too many commands
					// If the bar is too wide, then only use 10% of it for the commands
					<CommandBar
						commands={farCommandItems}
						width={
							width >= 992 && farCommandItems.length > 2 ? '10%' : undefined
						}
						bgColor={bgColor}
						color={textColor}
						far
					/>
				) : null}
			</Header>
		)
	},
)

const Header = styled.div<{ bgColor?: string }>`
	height: ${HEIGHT}px;
	width: 100%;
	background-color: ${({ bgColor, theme }) =>
		bgColor || theme.application().accent().hex()};
	position: relative;
	padding: 0 5px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const H3 = styled.h3<{ color?: string }>`
	font-weight: normal;
	font-size: 0.8em;
	margin: 0 8px 0 0;
	color: ${({ color, theme }) =>
		color || theme.application().background().hex()};
`

const Metadata = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0 1rem;
`
