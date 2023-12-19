/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DirectionalHint, TooltipHost } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { memo } from 'react'
import { Else, If, Then, When } from 'react-if'

import { useGetColumnValidationErrors } from '../hooks/useGetColumnValidationErrors.js'
import { useIconProps } from '../hooks/useIconProps.js'
import { useValidationIconProps } from '../hooks/useValidationIconProps.js'
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
	hostStyles,
} from './DefaultColumnHeader.styles.js'
import type { DefaultColumnHeaderProps } from './DefaultColumnHeader.types.js'
export type { DefaultColumnHeaderProps } from './DefaultColumnHeader.types.js'

const calloutProps = { gapSpace: 0 }

export const DefaultColumnHeader: React.FC<DefaultColumnHeaderProps> = memo(
	function DefaultColumnHeader({
		column,
		onSelect,
		sortable,
		onSort,
		validationResult,
	}) {
		const {
			isSorted,
			isSortedDescending,
			iconName,
			iconClassName,
			isIconOnly,
		} = column

		const tooltipId = useId('tooltip')

		const containerStyle = useContainerStyle(column)
		const textStyle = useTextStyle(column, !!onSelect)
		const iconStyles = useIconStyles()
		const [hovered, { setTrue: setHoverTrue, setFalse: setHoverFalse }] =
			useBoolean(false)
		const onSortClick = useDelegatedColumnClickHandler(column, onSort)
		const onColumnClick = useDelegatedColumnClickHandler(column, onSelect)

		const iconProps = useIconProps(validationResult)
		const validationIconProps = useValidationIconProps(
			iconProps,
			validationResult,
		)
		const errorColumnMessages = useGetColumnValidationErrors(
			'Values in this column violate the following constraints:',
			validationResult?.errors,
		)

		return (
			<div style={containerStyle}>
				<When
					condition={
						iconName &&
						validationResult !== undefined &&
						validationResult.errors.length === 0
					}
				>
					<LeftIcon className={iconClassName} iconName={iconName} />
				</When>
				<When
					condition={
						validationResult !== undefined && validationResult.errors.length > 0
					}
				>
					<TooltipHost
						content={errorColumnMessages}
						id={tooltipId}
						calloutProps={calloutProps}
						styles={hostStyles}
						directionalHint={DirectionalHint.bottomCenter}
					>
						<LeftIcon
							className={iconClassName}
							aria-describedby={tooltipId}
							{...validationIconProps}
						/>
					</TooltipHost>
				</When>
				<When condition={!isIconOnly}>
					<div
						onClick={onColumnClick}
						style={textStyle}
						className='column-title'
						title={column.name}
					>
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
