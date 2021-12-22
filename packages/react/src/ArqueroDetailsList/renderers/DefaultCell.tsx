/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { isNil } from 'lodash'
import React, { memo } from 'react'
import { Case, Default, Switch } from 'react-if'
import { getValue } from '../util'
import { ArrayCell } from './ArrayCell'
import { RichCellProps } from './types'
import {
	BooleanTextCell,
	DateCell,
	EmptyCell,
	NumberCell,
	ObjectCell,
	TextCell,
} from '.'

/**
 * Default rendering of cell contents.
 * Designed to look like a basic Excel-style sheet (e.g., right-align numbers by default).
 * But with no fancy/costly visualization
 */
export const DefaultCell: React.FC<RichCellProps> = memo(function DefaultCell(
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
			<Case condition={type === 'boolean'}>
				<BooleanTextCell {...props} />
			</Case>
			<Case condition={type === 'string'}>
				<TextCell {...props} />
			</Case>
			<Case condition={type === 'number'}>
				<NumberCell {...props} />
			</Case>
			<Case condition={type === 'date'}>
				<DateCell {...props} />
			</Case>
			<Case condition={type === 'array'}>
				<ArrayCell {...props} />
			</Case>
			<Default>
				<ObjectCell {...props} />
			</Default>
		</Switch>
	)
})
