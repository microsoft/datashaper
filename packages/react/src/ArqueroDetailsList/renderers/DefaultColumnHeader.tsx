/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, IDetailsColumnProps } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { memo, useMemo } from 'react'
import { useCellDimensions } from '../hooks'

export const DefaultColumnHeader: React.FC<IDetailsColumnProps> = memo(
	function DefaultColumnHeader(props) {
		const theme = useThematic()
		const { column } = props
		const { isSorted, isSortedDescending, iconName, iconClassName } = column
		const dimensions = useCellDimensions(column)

		const containerStyle = useMemo(
			() => ({
				display: 'flex',
				justifyContent: 'space-between',
				width: dimensions.width,
				borderBottom: column.data?.selected
					? `2px solid ${theme.application().accent().hex()}`
					: `2px solid transparent`,
			}),
			[theme, dimensions, column],
		)

		const fontStyle = useMemo(
			() => ({
				color: column.data?.selected
					? theme.application().accent().hex()
					: theme.application().foreground().hex(),
			}),
			[theme, column],
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
				<div style={fontStyle}>{column.name}</div>
				{/* the standard details list renders its icon at far left. should we replicate? */}
				{iconName ? (
					<Icon className={iconClassName} iconName={iconName} />
				) : null}
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
