/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata } from '@data-wrangling-components/core'
import { isEmpty } from 'lodash'
import React, { memo, useCallback, useMemo } from 'react'
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
	NumberMagnitudeCell,
} from './'

/**
 * Chooses what to render based on data type.
 */
export const SmartCell: React.FC<RichCellProps> = memo(function SmartCell(
	props,
) {
	const { metadata, item, column, onColumnClick } = props
	const { type } = metadata
	const value = getValue(item, column)
	const magnitude = useNumberMagnitude(type, value, metadata)
	const handleColumnClick = useCallback(
		ev => {
			column &&
				onColumnClick &&
				onColumnClick(ev, column?.data?.selected ? undefined : column)
		},
		[column, onColumnClick],
	)
	const cellStyle = useMemo(() => {
		const style: React.CSSProperties = {}
		if (onColumnClick) {
			style.cursor = 'pointer'
		}
		if (column?.data?.selected) {
			style.fontWeight = 'bold'
		}
		return style
	}, [onColumnClick, column])
	return (
		<div onClick={handleColumnClick} style={cellStyle}>
			<Switch>
				<Case condition={isEmpty(value)}>
					<EmptyCell textAlign={type === 'number' ? 'right' : 'left'} />
				</Case>
				<Case condition={type === 'string'}>
					<TextCell {...props} />
				</Case>
				<Case condition={type === 'boolean'}>
					<BooleanSymbolCell {...props} />
				</Case>
				<Case condition={type === 'number'}>
					<NumberMagnitudeCell {...props} magnitude={magnitude} />
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
		</div>
	)
})

function useNumberMagnitude(
	type: string,
	value: any,
	meta: ColumnMetadata,
): number {
	return useMemo(() => {
		if (type !== 'number' || isNil(value)) {
			return 0
		}
		const range = (meta.stats?.max || 1) - (meta.stats?.min || 0)
		const mag = (value - (meta.stats?.min || 0)) / range
		return mag
	}, [type, value, meta])
}
