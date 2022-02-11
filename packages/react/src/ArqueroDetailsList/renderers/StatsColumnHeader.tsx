/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnStats, formatIfNumber } from '@data-wrangling-components/core'
import { useThematic } from '@thematic/react'
import upperFirst from 'lodash/upperFirst.js'
import { memo, useMemo } from 'react'
import { StatsColumnType } from '../types.js'
import { RichHeaderProps } from './types.js'

const pretty: Record<string, string> = {
	distinct: 'unique',
	invalid: 'empty',
}

const CELL_HEIGHT = 14

const DEFAULT_STATS: StatsColumnType[] = [
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]

/**
 * Renders a column header with basic stats.
 * The list of stats is configurable, but we aren't exposing that in the table yet.
 * Note that the size is fixed to accommodate only four, so we would need a dynamic header size.
 */
export const StatsColumnHeader: React.FC<RichHeaderProps> = memo(
	function StatsColumnHeader({
		metadata,
		stats = DEFAULT_STATS,
		column,
		onClick,
	}) {
		const theme = useThematic()
		const cells = useMemo(() => {
			const st = (metadata.stats || {}) as any
			return stats.map(stat => {
				const value: any = st[stat]
				return (
					<StatCell name={stat} value={value} key={`${column.key}-${stat}`} />
				)
			})
		}, [metadata, column, stats])

		const title = useTooltip(metadata.stats)

		const styles = useMemo(() => {
			return {
				height: stats.length * CELL_HEIGHT,
				fontWeight: 'normal',
				fontSize: 10,
				color: theme.application().midContrast().hex(),
				cursor: onClick ? 'pointer' : 'inherit',
			}
		}, [onClick, theme, stats])

		return (
			<div
				onClick={e => onClick && onClick(e, column, metadata)}
				title={title}
				style={styles}
			>
				{cells}
			</div>
		)
	},
)

const StatCell: React.FC<{ name: string; value?: number }> = ({
	name,
	value,
}) => {
	return value !== undefined ? (
		<div
			style={{
				height: CELL_HEIGHT,
				display: 'flex',
				justifyContent: 'space-between',
				paddingLeft: 4,
				paddingRight: 4,
				lineHeight: 1,
			}}
		>
			<div style={{ textTransform: 'capitalize' }}>{pretty[name] || name}:</div>
			<div
				style={{
					maxWidth: '100%',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',
				}}
			>
				{formatIfNumber(value)}
			</div>
		</div>
	) : null
}

function useTooltip(stats?: ColumnStats): string {
	return useMemo(() => {
		const { bins, categories, ...nobins } = stats || {}
		return Object.entries(nobins).reduce((acc, cur, idx) => {
			const [key, value] = cur
			const nice = upperFirst(pretty[key] || key)
			return acc + (idx > 0 ? '\n' : '') + `${nice}: ${formatIfNumber(value)}`
		}, '')
	}, [stats])
}
