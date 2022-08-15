/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from '@essex/styled-components'
import { memo, useMemo } from 'react'

import { HEIGHT } from './ArqueroTableHeader.constants.js'
import {
	useColorDefaults,
	useColumnCounts,
	useRowCounts,
} from './hooks/index.js'
import type { ArqueroTableHeaderProps } from './index.js'
import { TableName } from './TableName.js'

export const ArqueroTableHeader: React.FC<ArqueroTableHeaderProps> = memo(
	function ArqueroTableHeader({
		table,
		name,
		showRowCount = true,
		showColumnCount = true,
		commandBar,
		farCommandBar,
		visibleColumns,
		onRenameTable,
		bgColor,
		color,
	}) {
		const { background, foreground } = useColorDefaults(color, bgColor)
		const groupCount = useMemo((): any => {
			return table.isGrouped() ? table.groups().size : 0
		}, [table])

		const columnCounts = useColumnCounts(table, visibleColumns)
		const rowCounts = useRowCounts(table)
		return (
			<Header bgColor={background} color={foreground}>
				<Left>{commandBar}</Left>
				<Middle>
					{name ? (
						<TableName
							onRenameTable={onRenameTable}
							name={name}
							color={foreground}
						/>
					) : null}
					{showRowCount === true ? (
						<H3>
							{`${rowCounts.visible} row${rowCounts.visible !== 1 ? 's' : ''}${
								rowCounts.hidden > 0 ? ` (${rowCounts.hidden} filtered)` : ''
							}`}
						</H3>
					) : null}
					{showColumnCount === true ? (
						<H3>
							{`${columnCounts.visible} col${
								columnCounts.visible !== 1 ? 's' : ''
							}${
								columnCounts.hidden > 0
									? ` (${columnCounts.hidden} hidden)`
									: ''
							}`}
						</H3>
					) : null}
					{groupCount ? <H3>{groupCount} groups</H3> : null}
				</Middle>
				<Right>{farCommandBar}</Right>
			</Header>
		)
	},
)

const Header = styled.div<{ bgColor: string; color: string }>`
	height: ${HEIGHT}px;
	width: 100%;
	background-color: ${({ bgColor }) => bgColor};
	color: ${({ color }) => color};
	position: relative;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
`

const Left = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-start;
`

const Middle = styled.div`
	flex: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
`
const Right = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-end;
`
