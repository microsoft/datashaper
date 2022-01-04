/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnStats } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { Sparkbar } from '../../charts'
import { useCellDimensions } from '../hooks'
import { RichHeaderProps } from './types'

const PADDING_HEIGHT = 20

export const HistogramColumnHeader: React.FC<RichHeaderProps> = memo(
	function HistogramColumnHeader({ metadata, color, ...props }) {
		const { column } = props
		const dimensions = useCellDimensions(column)
		const bins = metadata.stats?.bins
		const values = useMemo(() => (bins || []).map(b => b.count), [bins])
		const title = useTooltip(metadata.stats)
		return (
			<div title={title} style={{ height: dimensions.height + PADDING_HEIGHT }}>
				{bins ? (
					<Sparkbar
						data={values}
						width={dimensions.width - 1}
						height={dimensions.height}
						color={color}
					/>
				) : null}
			</div>
		)
	},
)

function useTooltip(stats?: ColumnStats): string {
	return useMemo(() => {
		const { bins } = stats || {}
		return (bins || []).reduce((acc, cur, idx) => {
			const { min, count } = cur
			return acc + (idx > 0 ? '\n' : '') + `${min}: ${count}`
		}, '')
	}, [stats])
}
