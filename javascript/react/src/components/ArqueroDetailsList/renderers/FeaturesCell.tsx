/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'
import { memo } from 'react'
import { Case, Default, Switch } from 'react-if'

import {
	categories,
	getValue,
	isBlank,
	isEmpty,
} from '../ArqueroDetailsList.utils.js'
import { useNumberMagnitude } from '../hooks/useNumberMagnitude.js'
import { ArrayDropdownCell } from './ArrayDropdownCell.js'
import { BlankCell } from './BlankCell.js'
import { CellContainer } from './CellContainer.js'
import { EmptyCell } from './EmptyCell.js'
import type { FeatureCellProps } from './FeaturesCell.types.js'
import {
	BooleanSymbolCell,
	CategoricalBarCell,
	DateCell,
	DefaultCell,
	NumberMagnitudeCell,
	SparkbarCell,
	SparklineCell,
	TextCell,
} from './index.js'
export type { FeatureCellProps } from './FeaturesCell.types.js'

/**
 * Chooses what to render based on the features prop
 */
export const FeaturesCell: React.FC<FeatureCellProps> = memo(
	function FeaturesCell(props) {
		const { features, field, item, column, index, onColumnClick } = props
		const type = field?.type
		const value = getValue(item, column)
		const magnitude = useNumberMagnitude(value, field, type)
		const histo = categories(value)
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
					<Case
						condition={features.showBooleanSymbol && type === DataType.Boolean}
					>
						<BooleanSymbolCell {...props} />
					</Case>
					<Case
						condition={features.showNumberMagnitude && type === DataType.Number}
					>
						<NumberMagnitudeCell {...props} magnitude={magnitude} />
					</Case>
					<Case
						condition={features.showDateFormatted && type === DataType.Date}
					>
						<DateCell {...props} />
					</Case>
					<Case
						condition={features.showCategoricalBar && type === DataType.Array}
					>
						<CategoricalBarCell {...props} categories={histo} />
					</Case>
					<Case
						condition={
							features.showSparkbar &&
							type === DataType.Array &&
							histo &&
							histo['length' ?? 0]
						}
					>
						<SparkbarCell {...props} />
					</Case>
					<Case condition={features.showDropdown && type === DataType.Array}>
						<ArrayDropdownCell rowIndex={index || 0} {...props} />
					</Case>
					<Case condition={features.showSparkline && type === DataType.Array}>
						<SparklineCell {...props} />
					</Case>
					<Default>
						<DefaultCell {...props} />
					</Default>
				</Switch>
			</CellContainer>
		)
	},
)
