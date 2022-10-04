/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'
import { memo } from 'react'
import { Case, Default, Switch } from 'react-if'

import { getValue, isBlank, isEmpty } from '../ArqueroDetailsList.utils.js'
import { useNumberMagnitude } from '../hooks/useNumberMagnitude.js'
import { BlankCell } from './BlankCell.js'
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
	const { field, item, column, onColumnClick } = props
	const type = field?.type
	const value = getValue(item, column)
	const magnitude = useNumberMagnitude(value, field, type)

	return (
		<CellContainer onClick={onColumnClick} column={column}>
			<Switch>
				<Case condition={isBlank(value)}>
					<BlankCell />
				</Case>
				<Case condition={isEmpty(value)}>
					<EmptyCell
						textAlign={
							type === DataType.Number || type === DataType.Boolean
								? 'right'
								: 'left'
						}
						virtual={column?.data.virtual}
					/>
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
