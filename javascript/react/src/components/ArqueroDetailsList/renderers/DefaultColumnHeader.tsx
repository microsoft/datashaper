/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'
import { Else, If, Then, When } from 'react-if'

import {
	useContainerStyle,
	useDelegatedColumnClickHandler,
	useIconStyles,
	useTextStyle,
} from './DefaultColumnHeader.hooks.js'
import {
	HoverContainer,
	LeftIcon,
	RightIcon,
} from './DefaultColumnHeader.styles.js'
import type { DefaultColumnHeaderProps } from './DefaultColumnHeader.types.js'
export type { DefaultColumnHeaderProps } from './DefaultColumnHeader.types.js'

export const DefaultColumnHeader: React.FC<DefaultColumnHeaderProps> = memo(
	function DefaultColumnHeader({ column, onSelect, sortable, onSort }) {
		const {
			isSorted,
			isSortedDescending,
			iconName,
			iconClassName,
			isIconOnly,
		} = column

		const containerStyle = useContainerStyle(column)
		const textStyle = useTextStyle(column, !!onSelect)
		const iconStyles = useIconStyles()
		const [hovered, { setTrue: setHoverTrue, setFalse: setHoverFalse }] =
			useBoolean(false)
		const onSortClick = useDelegatedColumnClickHandler(column, onSort)
		const onColumnClick = useDelegatedColumnClickHandler(column, onSelect)

		return (
			/* eslint-disable jsx-a11y/mouse-events-have-key-events */
			<div style={containerStyle}>
				<When condition={iconName}>
					<LeftIcon className={iconClassName} iconName={iconName} />
				</When>
				<When condition={!isIconOnly}>
					<div onClick={onColumnClick} style={textStyle} title={column.name}>
						{column.name}
					</div>
					<When condition={sortable}>
						<HoverContainer
							onMouseOver={setHoverTrue}
							onMouseOut={setHoverFalse}
						>
							<If condition={isSorted}>
								<Then>
									<RightIcon
										onClick={onSortClick}
										iconName={isSortedDescending ? 'SortDown' : 'SortUp'}
										styles={iconStyles}
									/>
								</Then>
								<Else>
									<When condition={hovered}>
										<RightIcon
											onClick={onSortClick}
											iconName={'Sort'}
											styles={iconStyles}
										/>
									</When>
								</Else>
							</If>
						</HoverContainer>
					</When>
				</When>
			</div>
		)
	},
)
