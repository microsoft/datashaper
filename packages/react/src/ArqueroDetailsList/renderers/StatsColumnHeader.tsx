/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnStats } from '@data-wrangling-components/core'
import { useThematic } from '@thematic/react'
import { upperFirst } from 'lodash'
import React, { memo, useMemo } from 'react'
import { RichHeaderProps } from './types'

const pretty: Record<string, string> = {
	distinct: 'unique',
	invalid: 'empty',
}

/**
 * Renders a column header with basic stats.
 * The list of stats is configurable, but we aren't exposing that in the table yet.
 * Note that the size is fixed to accommodate only four, so we would need a dynamic header size.
 */
export const StatsColumnHeader: React.FC<RichHeaderProps> = memo(
	function StatsColumnHeader({
		metadata,
		stats = ['min', 'max', 'distinct', 'invalid'],
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
				// TODO: there is a layout issue resulting in this margin kludge
				marginTop: -14,
				height: 70,
				fontWeight: 'normal',
				fontSize: 10,
				color: theme.application().midContrast().hex(),
				cursor: onClick ? 'pointer' : 'inherit',
			}
		}, [onClick, theme])

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
				height: 14,
				display: 'flex',
				justifyContent: 'space-between',
				paddingLeft: 4,
				paddingRight: 4,
			}}
		>
			<div style={{ textTransform: 'capitalize' }}>{pretty[name] || name}:</div>
			<div>{value}</div>
		</div>
	) : null
}

function useTooltip(stats?: ColumnStats): string {
	return useMemo(() => {
		const { bins, categories, ...nobins } = stats || {}
		return Object.entries(nobins).reduce((acc, cur, idx) => {
			const [key, value] = cur
			const nice = upperFirst(pretty[key] || key)
			return acc + (idx > 0 ? '\n' : '') + `${nice}: ${value}`
		}, '')
	}, [stats])
}
