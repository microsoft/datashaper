/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IColumn } from '@fluentui/react'
import { isArray } from 'lodash'
import React, { memo } from 'react'
import { Case, Default, Else, If, Switch, Then } from 'react-if'
import { EmptyCell } from './EmptyCell'
import { BooleanCell, DefaultCell, SparkbarCell, SparklineCell } from './'

export interface SmartCellProps {
	item?: any
	index?: number
	column?: IColumn
}

/**
 * Chooses what to render based on data type.
 */
export const SmartCell: React.FC<SmartCellProps> = memo(function SmartCell(
	props,
) {
	const { item, column } = props
	const value = column?.fieldName && item[column.fieldName]
	const cellWidth = column?.currentWidth || 0
	// TODO: an array is not always a sparkline - if non-numeric maybe a histogram bar?
	return (
		<Switch>
			<Case condition={value === null || value === undefined}>
				<EmptyCell />
			</Case>
			<Case condition={typeof value === 'boolean'}>
				<BooleanCell {...props} />
			</Case>
			<Case condition={isArray(value)}>
				{/* if bars can be at least one pixel, otherwise use a line */}
				<If condition={value?.length < cellWidth}>
					<Then>
						<SparkbarCell {...props} />
					</Then>
					<Else>
						<SparklineCell {...props} />
					</Else>
				</If>
			</Case>
			<Default>
				<DefaultCell {...props} />
			</Default>
		</Switch>
	)
})
