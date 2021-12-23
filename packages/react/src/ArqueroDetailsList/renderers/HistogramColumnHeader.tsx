/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'
import { Sparkbar } from '../../charts'
import { useCellDimensions } from './hooks'
import { RichHeaderProps } from './types'
import { DefaultColumnHeader } from '.'

export const HistogramColumnHeader: React.FC<RichHeaderProps> = memo(
	function HistogramColumnHeader({ metadata, bins, color, ...props }) {
		const { column } = props
		const dimensions = useCellDimensions(column)
		const values = useMemo(() => (bins || []).map(b => b.count), [bins])
		// TODO: move the default bit to an outer component such as the renderer function
		// we should make these more composable, and each rich header type should not include
		// the default
		return (
			<div>
				<DefaultColumnHeader {...props} />
				<div>
					{bins ? (
						<Sparkbar
							data={values}
							width={dimensions.width}
							height={dimensions.height}
							color={color}
						/>
					) : null}
				</div>
			</div>
		)
	},
)
