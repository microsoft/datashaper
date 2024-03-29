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
import type { RichHeaderProps } from './types.js'

/**
 * Renders a column header with basic stats.
 * The list of stats is configurable, but we aren't exposing that in the table yet.
 * Note that the size is fixed to accommodate only four, so we would need a dynamic header size.
 */
export const StatsColumnHeader: React.FC<RichHeaderProps> = memo(
	function StatsColumnHeader({
		field,
		metadata,
		stats = DEFAULT_STATS,
		column,
		onSelect,
		disabled,
	}) {
		const theme = useTheme()
		const cells = useMemo(() => {
			const st = (metadata || EMPTY_OBJECT) as any
			return stats.map((stat) => {
				const value: any = stat === StatsColumnType.Type ? field.type : st[stat]
				return (
					<StatCell
						name={stat}
						value={value}
						key={`${column?.key || field.name}-${stat}`}
					/>
				)
			})
		}, [field, metadata, column, stats])

		const title = useTooltip(metadata)

		const styles = useMemo<React.CSSProperties>(() => {
			return {
				height: stats.length * STATS_HEADER_ITEM_HEIGHT,
				fontWeight: 'normal',
				fontSize: 10,
				color: disabled
					? theme.palette.neutralTertiary
					: theme.palette.neutralSecondary,
				cursor: onSelect ? 'pointer' : 'inherit',
			}
		}, [onSelect, theme, stats, disabled])

		const handleOnClick = useCallback(
			(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
				!disabled && onSelect?.(e, column),
			[column, disabled, onSelect],
		)

		return (
			<div onClick={handleOnClick} title={title} style={styles}>
				{cells}
			</div>
		)
	},
)
