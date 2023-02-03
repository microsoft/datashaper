/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import { memo, useEffect, useRef, useState } from 'react'

import { StatsColumnType } from '../../ArqueroDetailsList/ArqueroDetailsList.types.js'
import { HistogramColumnHeader } from '../../ArqueroDetailsList/renderers/HistogramColumnHeader.js'
import { StatsColumnHeader } from '../../ArqueroDetailsList/renderers/StatsColumnHeader.js'
import { DataDisplay } from './CodebookStatsField.styles.js'
import type { CodebookStatsFieldProps } from './CodebookStatsField.types.js'

const DEFAULT_STATS = [
	StatsColumnType.Count,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Example,
]

export const CodebookStatsField: React.FC<CodebookStatsFieldProps> = memo(
	function CodebookStatsField(props) {
		const { field, metadata, styles, histogramColumn } = props
		const [column, setColumn] = useState(histogramColumn)
		const wrapperRef = useRef<HTMLDivElement | null>(null)

		useEffect(() => {
			if (!histogramColumn) {
				setColumn({
					currentWidth:
						(wrapperRef?.current?.clientWidth || 0) -
						(Number(styles?.root?.padding || 0) * 2 ?? 0),
				} as IColumn)
			}
		}, [wrapperRef, histogramColumn, styles])

		const meta = metadata?.columns?.[field.name]
		return (
			<div ref={wrapperRef} style={styles?.root}>
				<DataDisplay>
					<StatsColumnHeader
						stats={DEFAULT_STATS}
						field={field}
						metadata={meta}
						disabled={field.exclude}
					/>
					<HistogramColumnHeader
						column={column}
						field={field}
						metadata={meta}
						disabled={field.exclude}
					/>
				</DataDisplay>
			</div>
		)
	},
)
