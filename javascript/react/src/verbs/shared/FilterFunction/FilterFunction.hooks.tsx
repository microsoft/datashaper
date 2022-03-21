/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criterion } from '@data-wrangling-components/core'
import {
	BooleanComparisonOperator,
	DataType,
	NumericComparisonOperator,
	StringComparisonOperator,
	types,
} from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useIsEmpty(criterion: Criterion): boolean {
	return useMemo(() => {
		const { operator } = criterion
		return (
			operator === NumericComparisonOperator.IsEmpty ||
			operator === NumericComparisonOperator.IsNotEmpty ||
			operator === StringComparisonOperator.IsEmpty ||
			operator === StringComparisonOperator.IsNotEmpty ||
			operator === BooleanComparisonOperator.IsTrue ||
			operator === BooleanComparisonOperator.IsFalse ||
			operator === BooleanComparisonOperator.IsEmpty ||
			operator === BooleanComparisonOperator.IsNotEmpty
		)
	}, [criterion])
}

export function usePlaceholderText(
	type: string | undefined,
): string | undefined {
	return useMemo(() => {
		switch (type) {
			case DataType.String:
				return 'text or column'
			case DataType.Number:
				return 'number or column'
			case DataType.Boolean:
				return 'boolean or column'
		}
	}, [type])
}

export function useColumnTyping(
	table: ColumnTable,
	column: string,
): {
	type: string | undefined
	columnFilter: (name: string) => boolean
} {
	const tps = useMemo(() => {
		return table ? types(table) : {}
	}, [table])

	const type = useMemo(() => tps[column], [tps, column])

	const columnFilter = useMemo(() => {
		return (name: string) => tps[name] === type
	}, [tps, type])

	return {
		type,
		columnFilter,
	}
}
