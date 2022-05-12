/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import type { Step } from '@data-wrangling-components/core'
import { isNumericInputStep } from '@data-wrangling-components/core'
import { columnTypes, DataType } from '@essex/arquero'

export function useColumnFilter(step: Step<unknown>, table?: ColumnTable) {
	const typeMap = useMemo(() => {
		if (table) {
			return columnTypes(table)
		}
		return {}
	}, [table])
	return useCallback(
		(name: string) => {
			return isNumericInputStep(step) ? typeMap[name] === DataType.Number : true
		},
		[typeMap, step],
	)
}
