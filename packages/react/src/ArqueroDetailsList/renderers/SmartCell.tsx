/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isNil } from 'lodash'
import React, { memo } from 'react'
import { Case, Default, Switch } from 'react-if'
import { getValue } from '../util'
import { EmptyCell } from './EmptyCell'
import { RichCellProps } from './types'
import {
	BooleanSymbolCell,
	DateCell,
	ObjectCell,
	SmartArrayCell,
	TextCell,
	NumberCell,
} from './'

/**
 * Chooses what to render based on data type.
 */
export const SmartCell: React.FC<RichCellProps> = memo(function SmartCell(
	props,
) {
	const { metadata, item, column } = props
	const { type } = metadata
	const value = getValue(item, column)
	return (
		<Switch>
			<Case condition={isNil(value)}>
				<EmptyCell textAlign={type === 'number' ? 'right' : 'left'} />
			</Case>
			<Case condition={type === 'string'}>
				<TextCell {...props} />
			</Case>
			<Case condition={type === 'boolean'}>
				<BooleanSymbolCell {...props} />
			</Case>
			<Case condition={type === 'number'}>
				<NumberCell {...props} numberFormat={','} />
			</Case>
			<Case condition={type === 'date'}>
				<DateCell {...props} />
			</Case>
			<Case condition={type === 'array'}>
				<SmartArrayCell {...props} />
			</Case>
			<Default>
				<ObjectCell {...props} />
			</Default>
		</Switch>
	)
})
