/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnMetadata } from '@data-wrangling-components/core'
import { DataType } from '@data-wrangling-components/core'
import isNil from 'lodash-es/isNil.js'
import { memo, useMemo } from 'react'
import { Case, Default, Switch } from 'react-if'

import { categories, getValue, isEmpty } from '../util/index.js'
import { ArrayDropdownCell } from './ArrayDropdownCell.js'
import { CellContainer } from './CellContainer.js'
import { EmptyCell } from './EmptyCell.js'
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
import type { FeatureCellProps } from './types.js'

/**
 * Chooses what to render based on the features prop
 */
export const FeaturesCell: React.FC<FeatureCellProps> = memo(
	function FeaturesCell(props) {
		const { features, metadata, item, column, index, onColumnClick } = props
		const type = (metadata && metadata.type) ?? undefined
		const value = getValue(item, column)
		const magnitude = useNumberMagnitude(value, metadata, type)
		const histo = categories(value)

		return (
			<CellContainer onClick={onColumnClick} column={column}>
				<Switch>
					<Case condition={isEmpty(value)}>
						<EmptyCell
							textAlign={type === DataType.Number ? 'right' : 'left'}
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
		const mag = (value - (meta?.stats?.min || 0)) / range
		return mag
	}, [type, value, meta])
}
