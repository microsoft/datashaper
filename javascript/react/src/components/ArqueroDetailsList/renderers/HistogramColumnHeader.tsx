/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Category, FieldMetadata } from '@datashaper/schema'
import { formatIfNumber } from '@datashaper/tables'
import { Sparkbar } from '@essex/charts-react'
import { TooltipHost } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'

import { HISTOGRAM_HEADER_PADDING } from '../ArqueroDetailsList.constants.js'
import { useCellDimensions } from '../hooks/index.js'
import type { RichHeaderProps } from './types.js'

/**
 * Renders a histogram for column values in the header.
 * For numbers it will use the bin partitioning.
 * For strings it will be the unique counts (if categories exist).
 */
export const HistogramColumnHeader: React.FC<RichHeaderProps> = memo(
	function HistogramColumnHeader({ field, color, ...props }) {
		const { column, onClick } = props
		const dimensions = useCellDimensions(column, false)

		const categorical = field.type === 'string'

		const bins = categorical ? field.metadata?.categories : field.metadata?.bins
		const values = useMemo(() => (bins || []).map(b => b.count), [bins])
		const categories = useCategories(field.metadata, categorical)
		const title = useTooltip(categories)
		const legend = useLegend(categories)
		const [hover, setHover] = useState<string>()
		const [id, setId] = useState<string>()
		const handleBarHover = useCallback(
			(e: MouseEvent) => {
				const { target, type } = e
				const index = (target as any).dataset.index
				const id = (target as any).id
				if (type === 'mouseover' && index >= 0) {
					setHover(legend[index] || '')
					setId(id)
				} else {
					setHover(undefined)
					setId(undefined)
				}
			},
			[legend, setHover, setId],
		)

		const styles = useMemo(() => {
			return {
				height: dimensions.height + HISTOGRAM_HEADER_PADDING,
				cursor: onClick ? 'pointer' : 'inherit',
			}
		}, [onClick, dimensions])

		const enough = field.metadata?.distinct || 0

		return (
			<div style={styles}>
				{enough > 1 && bins ? (
					<div
						onClick={e => onClick && bins && onClick(e, column, field)}
						title={title}
					>
						<TooltipHost
							content={hover}
							id={id}
							calloutProps={{ gapSpace: 5, target: `#${id}` }}
						>
							<Sparkbar
								categorical={categorical}
								data={values}
								width={dimensions.width - 1}
								height={dimensions.height}
								color={color}
								legend={legend}
								onBarHover={handleBarHover}
							/>
						</TooltipHost>
					</div>
				) : null}
			</div>
		)
	},
)

function useCategories(
	stats?: FieldMetadata,
	categorical?: boolean,
): Category[] {
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
			return acc + (idx > 0 ? '\n' : '') + `${formatIfNumber(name)}: ${count}`
		}, '')
	}, [categories])
}

function useLegend(categories: Category[]): string[] {
	return useMemo(() => {
		return categories.map(cat => `${formatIfNumber(cat.name)}: ${cat.count}`)
	}, [categories])
}
