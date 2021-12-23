/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, IDetailsColumnProps } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { memo, useMemo } from 'react'
import { useCellDimensions } from './hooks'

export const DefaultColumnHeader: React.FC<IDetailsColumnProps> = memo(
	function DefaultColumnHeader(props) {
		const theme = useThematic()
		const { column } = props
		const { isSorted, isSortedDescending } = column
		const dimensions = useCellDimensions(column)

		const containerStyle = useMemo(
			() => ({
				display: 'flex',
				justifyContent: 'space-between',
				width: dimensions.width,
			}),
			[dimensions],
		)

		const iconStyles = useMemo(
			() => ({
				root: {
					fontSize: 12,
					color: theme.application().midHighContrast().hex(),
				},
			}),
			[theme],
		)

		return (
			<div style={containerStyle}>
				<div>{column.name}</div>
				{isSorted ? (
					<Icon
						iconName={isSortedDescending ? 'SortDown' : 'SortUp'}
						styles={iconStyles}
					/>
				) : null}
			</div>
		)
	},
)
