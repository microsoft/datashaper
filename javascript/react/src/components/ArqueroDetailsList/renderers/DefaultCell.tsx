/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'
import { determineType } from '@datashaper/tables'
import { memo, useMemo } from 'react'
import { Case, Default, Switch } from 'react-if'

import { getValue, isBlank, isEmpty } from '../ArqueroDetailsList.utils.js'
import { ArrayCell } from './ArrayCell.js'
import { BlankCell } from './BlankCell.js'
import {
	BooleanTextCell,
	DateCell,
	EmptyCell,
	NumberCell,
	ObjectCell,
	TextCell,
} from './index.js'
import type { RichCellProps } from './types.js'

/**
 * Default rendering of cell contents.
 * Designed to look like a basic Excel-style sheet (e.g., right-align numbers by default).
 * But with no fancy/costly visualization
 */
export const DefaultCell: React.FC<RichCellProps> = memo(function DefaultCell(
	props,
) {
	const { field, item, column, onColumnClick } = props
	const value = getValue(item, column)
	const type = field?.type || determineType(value)

	const cellStyle = useMemo(() => {
		const style: React.CSSProperties = {
			width: '100%',
		}
		if (onColumnClick) {
			style.cursor = 'pointer'
		}
		if (column?.data?.selected) {
			style.fontWeight = 'bold'
		}
		return style
	}, [onColumnClick, column])

	return (
		<div style={cellStyle}>
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
				<Case condition={type === DataType.Boolean}>
					<BooleanTextCell {...props} />
				</Case>
				<Case condition={type === DataType.String}>
					<TextCell {...props} />
				</Case>
				<Case condition={type === DataType.Number}>
					<NumberCell {...props} numberFormat={','} />
				</Case>
				<Case condition={type === DataType.Date}>
					<DateCell {...props} />
				</Case>
				<Case condition={type === DataType.Array}>
					<ArrayCell {...props} />
				</Case>
				<Default>
					<ObjectCell {...props} />
				</Default>
			</Switch>
		</div>
	)
})
