/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnMetadata } from '@datashaper/arquero'
import { DataType } from '@datashaper/arquero'
import isNil from 'lodash-es/isNil.js'
import { memo, useMemo } from 'react'
import { Case, Default, Switch } from 'react-if'

import { getValue, isEmpty } from '../util/index.js'
import { CellContainer } from './CellContainer.js'
import { EmptyCell } from './EmptyCell.js'
import {
	BooleanSymbolCell,
	DateCell,
	NumberMagnitudeCell,
	ObjectCell,
	SmartArrayCell,
	TextCell,
} from './index.js'
import type { RichCellProps } from './types.js'

/**
 * Chooses what to render based on data type.
 */
export const SmartCell: React.FC<RichCellProps> = memo(function SmartCell(
	props,
) {
	const { metadata, item, column, onColumnClick } = props
	const type = metadata?.type
	const value = getValue(item, column)
	const magnitude = useNumberMagnitude(value, metadata, type)

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
	value: any,
	meta?: ColumnMetadata,
	type?: DataType,
): number {
	return useMemo(() => {
		if (type !== DataType.Number || isNil(value)) {
			return 0
		}
		const range = (meta?.stats?.max || 1) - (meta?.stats?.min || 0)
		const mag = range === 0 ? 0 : (value - (meta?.stats?.min || 0)) / range
		return mag
	}, [type, value, meta])
}
