/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsColumnProps } from '@fluentui/react'
import { Icon } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'

import { useCellDimensions } from '../hooks/index.js'
import type { ColumnClickFunction } from '../index.js'

const COMPACT_LINE_HEIGHT = 2

interface DefaultColumnHeaderProps extends IDetailsColumnProps {
	isClickable: boolean
	onClick?: ColumnClickFunction
}

export const DefaultColumnHeader: React.FC<DefaultColumnHeaderProps> = memo(
	function DefaultColumnHeader({ column, isClickable, onClick }) {
		const theme = useThematic()
		const { isSorted, isSortedDescending, iconName, iconClassName } = column
		const dimensions = useCellDimensions(column)

		const containerStyle = useMemo(
			() => ({
				lineHeight: column.data.compact ? COMPACT_LINE_HEIGHT : 'inherit',
				cursor: isClickable ? 'pointer' : 'inherit',
				display: 'flex',
				justifyContent: 'space-between',
				width: dimensions.width,
				borderBottom: column.data?.selected
					? `2px solid ${theme.application().accent().hex()}`
					: `2px solid transparent`,
			}),
			[theme, dimensions, column, isClickable],
		)

		const textStyle = useMemo(
			() => ({
				color: column.data?.selected
					? theme.application().accent().hex()
					: theme.application().foreground().hex(),
				width: '100%',
				textAlign: 'center' as const,
				overflow: 'hidden' as const,
				whiteSpace: 'nowrap' as const,
				textOverflow: 'ellipsis' as const,
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
			<div onClick={e => onClick && onClick(e, column)} style={containerStyle}>
				<div style={textStyle} title={column.name}>
					{column.name}
				</div>
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
