/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FieldMetadata } from '@datashaper/schema'
import { formatIfNumber } from '@datashaper/tables'
import { useTheme } from '@fluentui/react'
import upperFirst from 'lodash-es/upperFirst.js'
import { memo, useMemo } from 'react'

import { StatsColumnType } from '../ArqueroDetailsList.types.js'
import type { RichHeaderProps } from './types.js'

const pretty: Record<string, string> = {
	distinct: 'unique',
	invalid: 'empty',
}

const CELL_HEIGHT = 14

const DEFAULT_STATS: StatsColumnType[] = [
	StatsColumnType.Type,
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
		field,
		stats = DEFAULT_STATS,
		column,
		onClick,
	}) {
		const theme = useTheme()
		const cells = useMemo(() => {
			const st = (field.metadata || {}) as any
			return stats.map(stat => {
				const value: any = st[stat]
				return (
					<StatCell name={stat} value={value} key={`${column.key}-${stat}`} />
				)
			})
		}, [field, column, stats])

		const title = useTooltip(field.metadata)

		const styles = useMemo<React.CSSProperties>(() => {
			return {
				height: stats.length * CELL_HEIGHT,
				fontWeight: 'normal',
				fontSize: 10,
				color: theme.palette.neutralSecondary,
				cursor: onClick ? 'pointer' : 'inherit',
			}
		}, [onClick, theme, stats])

		return (
			<div
				onClick={e => onClick && onClick(e, column, field)}
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

function useTooltip(stats?: FieldMetadata): string {
	return useMemo(() => {
		const { bins, categories, ...nobins } = stats || {}
		return Object.entries(nobins).reduce((acc, cur, idx) => {
			const [key, value] = cur
			const nice = upperFirst(pretty[key] || key)
			return acc + (idx > 0 ? '\n' : '') + `${nice}: ${formatIfNumber(value)}`
		}, '')
	}, [stats])
}
