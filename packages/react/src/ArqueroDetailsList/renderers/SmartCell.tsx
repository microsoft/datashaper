/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata, DataType } from '@data-wrangling-components/core'
import { isNil } from 'lodash'
import { memo, useMemo } from 'react'
import { Case, Default, Switch } from 'react-if'
import { isEmpty, getValue } from '../util/index.js'
import { CellContainer } from './CellContainer'
import { EmptyCell } from './EmptyCell'
import type { RichCellProps } from './types.js'
import {
	BooleanSymbolCell,
	DateCell,
	ObjectCell,
	SmartArrayCell,
	TextCell,
	NumberMagnitudeCell,
} from './index.js'

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

	return (
		<CellContainer onClick={onColumnClick} column={column}>
			<Switch>
				<Case condition={isEmpty(value)}>
					<EmptyCell textAlign={type === DataType.Number ? 'right' : 'left'} />
				</Case>
				<Case condition={type === DataType.String}>
					<TextCell {...props} />
				</Case>
				<Case condition={type === DataType.Boolean}>
					<BooleanSymbolCell {...props} />
				</Case>
				<Case condition={type === DataType.Number}>
					<NumberMagnitudeCell {...props} magnitude={magnitude} />
				</Case>
				<Case condition={type === DataType.Date}>
					<DateCell {...props} />
				</Case>
				<Case condition={type === DataType.Array}>
					<SmartArrayCell {...props} />
				</Case>
				<Default>
					<ObjectCell {...props} />
				</Default>
			</Switch>
		</CellContainer>
	)
})

function useNumberMagnitude(
	type: DataType,
	value: any,
	meta: ColumnMetadata,
): number {
	return useMemo(() => {
		if (type !== DataType.Number || isNil(value)) {
			return 0
		}
		const range = (meta.stats?.max || 1) - (meta.stats?.min || 0)
		const mag = (value - (meta.stats?.min || 0)) / range
		return mag
	}, [type, value, meta])
}
