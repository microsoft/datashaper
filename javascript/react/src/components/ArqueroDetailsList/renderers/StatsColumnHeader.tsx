/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import { EMPTY_OBJECT } from '../../../empty.js'
import { STATS_HEADER_ITEM_HEIGHT } from '../ArqueroDetailsList.constants.js'
import { StatsColumnType } from '../ArqueroDetailsList.types.js'
import { StatCell } from './StatCell.js'
import { DEFAULT_STATS } from './StatsColumnHeader.constants.js'
import { useTooltip } from './StatsColumnHeader.hooks.js'
import type { StatsHeaderProps } from './types.js'

/**
 * Renders a column header with basic stats.
 * The list of stats is configurable, but we aren't exposing that in the table yet.
 * Note that the size is fixed to accommodate only four, so we would need a dynamic header size.
 */
export const StatsColumnHeader: React.FC<StatsHeaderProps> = memo(
	function StatsColumnHeader({
		field,
		stats = DEFAULT_STATS,
		column,
		onSelect,
	}) {
		const theme = useTheme()
		const cells = useMemo(() => {
			const st = (field.metadata || EMPTY_OBJECT) as any
			return stats.map(stat => {
				// data type is on the field, not the meta...
				const value: any = stat === StatsColumnType.Type ? field.type : st[stat]
				return (
					<StatCell
						name={stat}
						value={value}
						key={`${column?.key || field.name}-${stat}`}
					/>
				)
			})
		}, [field, column, stats])

		const title = useTooltip(field.metadata)

		const styles = useMemo<React.CSSProperties>(() => {
			return {
				height: stats.length * STATS_HEADER_ITEM_HEIGHT,
				fontWeight: 'normal',
				fontSize: 10,
				color: theme.palette.neutralSecondary,
				cursor: onSelect ? 'pointer' : 'inherit',
			}
		}, [onSelect, theme, stats])

		const handleOnClick = useCallback(
			(e: React.MouseEvent<HTMLElement, MouseEvent>) => onSelect?.(e, column),
			[column, onSelect],
		)

		return (
			<div onClick={handleOnClick} title={title} style={styles}>
				{cells}
			</div>
		)
	},
)
