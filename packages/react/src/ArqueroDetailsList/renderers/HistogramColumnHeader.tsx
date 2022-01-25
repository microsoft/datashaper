/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnStats, Category } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { Sparkbar } from '../../charts'
import { useCellDimensions } from '../hooks'
import { RichHeaderProps } from './types'

const PADDING_HEIGHT = 8

/**
 * Renders a histogram for column values in the header.
 * For numbers it will use the bin partitioning.
 * For strings it will be the unique counts (if categories exist).
 */
export const HistogramColumnHeader: React.FC<RichHeaderProps> = memo(
	function HistogramColumnHeader({ metadata, color, ...props }) {
		const { column, onClick } = props
		const dimensions = useCellDimensions(column, false)

		const categorical = metadata.type === 'string'

		const bins = categorical ? metadata.stats?.categories : metadata.stats?.bins
		const values = useMemo(() => (bins || []).map(b => b.count), [bins])
		const categories = useCategories(metadata.stats, categorical)
		const title = useTooltip(categories)

		const styles = useMemo(() => {
			return {
				height: dimensions.height + PADDING_HEIGHT,
				cursor: onClick ? 'pointer' : 'default',
			}
		}, [onClick, dimensions])

		// don't render a single bar
		if (metadata.stats?.distinct === 1) {
			return null
		}

		return (
			<>
				{bins ? (
					<div
						onClick={e => onClick && bins && onClick(e, column, metadata)}
						title={title}
						style={styles}
					>
						<Sparkbar
							categorical={categorical}
							data={values}
							width={dimensions.width - 1}
							height={dimensions.height}
							color={color}
						/>
					</div>
				) : null}
			</>
		)
	},
)

function useCategories(stats?: ColumnStats, categorical?: boolean): Category[] {
	return useMemo(() => {
		if (categorical) {
			return stats?.categories || []
		}
		return (stats?.bins || []).map(b => ({ name: `${b.min}`, count: b.count }))
	}, [stats, categorical])
}

function useTooltip(categories: Category[]): string {
	return useMemo(() => {
		return categories.reduce((acc, cur, idx) => {
			const { name, count } = cur
			return acc + (idx > 0 ? '\n' : '') + `${name}: ${count}`
		}, '')
	}, [categories])
}
