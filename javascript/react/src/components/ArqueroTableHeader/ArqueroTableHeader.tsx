/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useMemo } from 'react'

import { useCommandBarColorDefaults } from '../../hooks/index.js'
import { useColumnCounts, useRowCounts } from './ArqueroTableHeader.hooks.js'
import {
	Container,
	H3,
	Left,
	Middle,
	Right,
} from './ArqueroTableHeader.styles.js'
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
		background,
		color,
		styles,
	}) {
		const { background: bg, color: clr } = useCommandBarColorDefaults({
			color,
			background,
		})
		const groupCount = useMemo((): any => {
			return table.isGrouped() ? table.groups().size : 0
		}, [table])

		const columnCounts = useColumnCounts(table, visibleColumns)
		const rowCounts = useRowCounts(table)
		return (
			<Container background={bg} color={clr} style={styles?.root}>
				<Left>{commandBar}</Left>
				<Middle hasFarCommandBar={!!farCommandBar}>
					{name ? <TableName name={name} color={clr} /> : null}
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
				{farCommandBar && <Right>{farCommandBar}</Right>}
			</Container>
		)
	},
)
