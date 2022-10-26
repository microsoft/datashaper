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
}

export const DefaultColumnHeader: React.FC<DefaultColumnHeaderProps> = memo(
	function DefaultColumnHeader({ column, isClickable, onClick, isSortable }) {
		const {
			isSorted,
			isSortedDescending,
			iconName,
			iconClassName,
			isIconOnly,
		} = column

		const containerStyle = useContainerStyle(column, isClickable)
		const textStyle = useTextStyle(column)
		const iconStyles = useIconStyles()

		const [hovered, setHovered] = useState<boolean>(false)
		const handleMouseOver = useCallback(() => setHovered(true), [setHovered])
		const handleMouseOut = useCallback(() => setHovered(false), [setHovered])
		return (
			/* eslint-disable jsx-a11y/mouse-events-have-key-events */
			<div
				onClick={e => onClick && onClick(e, column)}
				style={containerStyle}
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
			>
				<When condition={iconName}>
					<Icon className={iconClassName} iconName={iconName} />
				</When>
				<When condition={!isIconOnly}>
					<div style={textStyle} title={column.name}>
						{column.name}
					</div>
					<When condition={isSortable}>
						<If condition={isSorted}>
							<Then>
								<Icon
									iconName={isSortedDescending ? 'SortDown' : 'SortUp'}
									styles={iconStyles}
								/>
							</Then>
							<Else>
								<When condition={hovered}>
									<Icon iconName={'Sort'} styles={iconStyles} />
								</When>
							</Else>
						</If>
					</When>
				</When>
			</div>
		)
	},
)

function useContainerStyle(column: IColumn, isClickable: boolean) {
	const dimensions = useCellDimensions(column)
	return useMemo(
		() => ({
			lineHeight: column.data.compact ? COMPACT_LINE_HEIGHT : 'inherit',
			cursor: isClickable ? 'pointer' : 'inherit',
			display: 'flex',
			justifyContent: 'space-between',
			width: dimensions.width,
		}),
		[dimensions, column, isClickable],
	)
}

function useTextStyle(column: IColumn) {
	const theme = useTheme()
	return useMemo(
		() => ({
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
		[theme, column],
	)
}

function useIconStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				position: 'absolute' as const,
				right: 8,
				fontSize: 12,
				color: theme.palette.neutralSecondary,
			},
		}),
		[theme],
	)
}
