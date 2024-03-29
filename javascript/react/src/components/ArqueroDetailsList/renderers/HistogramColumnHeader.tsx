/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sparkbar } from '@essex/charts-react'
import { TooltipHost, useTheme } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { useCellDimensions } from '../hooks/index.js'
import {
	useCalloutProps,
	useCategories,
	useHandleBarHoverHandler,
	useLegend,
	useStyles,
	useTooltip,
} from './HistogramColumnHeader.hooks.js'
import type { RichHeaderProps } from './types.js'

/**
 * Renders a histogram for column values in the header.
 * For numbers it will use the bin partitioning.
 * For strings it will be the unique counts (if categories exist).
 */
export const HistogramColumnHeader: React.FC<RichHeaderProps> = memo(
	function HistogramColumnHeader({ field, metadata, color, ...props }) {
		const { column, onSelect, disabled } = props
		const dimensions = useCellDimensions(column, false)
		const theme = useTheme()
		const _color = useMemo((): string | undefined => {
			return disabled ? theme.palette.neutralTertiary : color
		}, [color, disabled, theme])

		const categorical = field.type === 'string'

		const bins = categorical ? metadata?.categories : metadata?.bins
		const values = useMemo(
			() => (bins ?? EMPTY_ARRAY).map((b) => b.count),
			[bins],
		)
		const categories = useCategories(metadata, categorical)
		const title = useTooltip(categories)
		const legend = useLegend(categories)
		const [hover, setHover] = useState<string>()
		const [id, setId] = useState<string>()
		const handleBarHover = useHandleBarHoverHandler(legend, setId, setHover)
		const styles = useStyles(dimensions, Boolean(onSelect))
		const enough = metadata?.distinct || 0
		const calloutProps = useCalloutProps(id)
		const handleOnClick = useCallback(
			(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
				!disabled && onSelect?.(e, column),
			[column, onSelect, disabled],
		)

		return (
			<div style={styles}>
				{enough > 1 && bins ? (
					<div onClick={handleOnClick} title={title}>
						<TooltipHost content={hover} id={id} calloutProps={calloutProps}>
							<Sparkbar
								categorical={categorical}
								data={values}
								width={dimensions.width - 1}
								height={dimensions.height}
								color={_color}
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
