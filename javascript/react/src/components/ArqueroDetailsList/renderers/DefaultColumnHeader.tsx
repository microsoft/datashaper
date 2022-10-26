/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn, IDetailsColumnProps } from '@fluentui/react'
import { Icon, useTheme } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import { Else, If, Then, When } from 'react-if'

import { useCellDimensions } from '../hooks/index.js'
import type { ColumnClickFunction } from '../index.js'

const COMPACT_LINE_HEIGHT = 2

export interface DefaultColumnHeaderProps extends IDetailsColumnProps {
	isClickable: boolean
	onClick?: ColumnClickFunction
	isSortable?: boolean
	onSort?: ColumnClickFunction
}

export const DefaultColumnHeader: React.FC<DefaultColumnHeaderProps> = memo(
	function DefaultColumnHeader({
		column,
		isClickable,
		onClick,
		isSortable,
		onSort,
	}) {
		const {
			isSorted,
			isSortedDescending,
			iconName,
			iconClassName,
			isIconOnly,
		} = column

		const containerStyle = useContainerStyle(column)
		const textStyle = useTextStyle(column, isClickable)
		const iconStyles = useIconStyles()

		const [hovered, setHovered] = useState<boolean>(false)
		const handleMouseOver = useCallback(() => setHovered(true), [setHovered])
		const handleMouseOut = useCallback(() => setHovered(false), [setHovered])
		return (
			/* eslint-disable jsx-a11y/mouse-events-have-key-events */
			<div style={containerStyle}>
				<When condition={iconName}>
					<Icon className={iconClassName} iconName={iconName} />
				</When>
				<When condition={!isIconOnly}>
					<div
						onClick={e => onClick && onClick(e, column)}
						style={textStyle}
						title={column.name}
					>
						{column.name}
					</div>
					<When condition={isSortable}>
						<div
							onMouseOver={handleMouseOver}
							onMouseOut={handleMouseOut}
							style={{ width: 12 }}
						>
							<If condition={isSorted}>
								<Then>
									<Icon
										onClick={e => onSort && onSort(e, column)}
										iconName={isSortedDescending ? 'SortDown' : 'SortUp'}
										styles={iconStyles}
									/>
								</Then>
								<Else>
									<When condition={hovered}>
										<Icon
											onClick={e => onSort && onSort(e, column)}
											iconName={'Sort'}
											styles={iconStyles}
										/>
									</When>
								</Else>
							</If>
						</div>
					</When>
				</When>
			</div>
		)
	},
)

function useContainerStyle(column: IColumn) {
	const dimensions = useCellDimensions(column)
	return useMemo(
		() => ({
			lineHeight: column.data.compact ? COMPACT_LINE_HEIGHT : 'inherit',
			display: 'flex',
			justifyContent: 'space-between',
			width: dimensions.width,
		}),
		[dimensions, column],
	)
}

function useTextStyle(column: IColumn, isClickable: boolean) {
	const theme = useTheme()
	return useMemo(
		() => ({
			cursor: isClickable ? 'pointer' : 'inherit',
			color: column?.data.virtual
				? 'transparent'
				: column.data?.selected
				? theme.palette.themePrimary
				: theme.palette.neutralPrimary,
			width: '100%',
			textAlign: 'center' as const,
			overflow: 'hidden' as const,
			whiteSpace: 'nowrap' as const,
			textOverflow: 'ellipsis' as const,
		}),
		[theme, column, isClickable],
	)
}

function useIconStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				cursor: 'pointer',
				position: 'absolute' as const,
				right: 8,
				fontSize: 12,
				color: theme.palette.neutralSecondary,
			},
		}),
		[theme],
	)
}
