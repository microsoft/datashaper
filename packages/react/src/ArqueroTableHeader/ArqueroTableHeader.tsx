/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CommandBar, ICommandBarItemProps } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { memo, useMemo, useCallback, useState } from 'react'
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
		const [overflowCommands, setOverflowCommands] = useState()
		const commandItems = useCommandItems(commands, overflowCommands)

		const groupCount = useMemo((): any => {
			return table.isGrouped() ? table.groups().size : 0
		}, [table])

		// TODO: we can do the same thing for rows when a filter is applied
		const columnCounts = useColumnCounts(table, visibleColumns)
		const overflowButtonProps = useOverflowButtonProps()
		const handleDataDidRender = useHandleDataDidRender(
			overflowCommands,
			setOverflowCommands,
		)
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
					<CommandBar
						items={commandItems}
						styles={commandStyles}
						overflowButtonProps={overflowButtonProps}
						dataDidRender={handleDataDidRender}
						className="command-bar"
					/>
				) : null}
			</Header>
		)
	},
)

const useCommandItems = (commands, overflowCommands) => {
	const commandItems = useCommands(commands)
	return useMemo(() => {
		return overflowCommands || commandItems
	}, [overflowCommands, commandItems])
}

const useHandleDataDidRender = (overflowCommands, setOverflowCommands) => {
	const iconProps = useIconProps()
	return useCallback(
		data => {
			const { overflowItems } = data
			if (overflowItems.length) {
				if (!overflowCommands) {
					const commands = overflowItems.map(command => ({
						...command,
						iconProps: iconProps(command),
						text: command.text || command.title || '',
					}))
					setOverflowCommands(commands)
				}
			} else {
				setOverflowCommands(undefined)
			}
		},
		[overflowCommands, iconProps, setOverflowCommands],
	)
}

const useOverflowButtonProps = () => {
	const theme = useThematic()
	return useMemo(
		() => ({
			styles: {
				root: {
					background: theme.application().accent().hex(),
				},
				menuIcon: {
					color: theme.application().background().hex(),
				},
			},
		}),
		[theme],
	)
}

const useIconProps = (): ((
	item: ICommandBarItemProps,
) => ICommandBarItemProps) => {
	const theme = useThematic()
	return useCallback(
		(item: ICommandBarItemProps) => ({
			...item.iconProps,
			styles: {
				root: {
					color: theme.application().foreground().hex(),
				},
			},
		}),
		[theme],
	)
}

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
	background-color: ${({ theme }) => theme.application().accent().hex()};
	position: relative;
	padding: 0 5px;
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: space-around;
	.command-bar {
		width: 25%;
	}
`

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin: 0 8px 0 0;
	color: ${({ theme }) => theme.application().background().hex()};
`
