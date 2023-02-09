/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Maybe, Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { type Observable, from, map } from 'rxjs'

export function useWorkflowDataTable(
	id: string | undefined,
	workflow?: Workflow,
	existingTable?: ColumnTable,
): ColumnTable | undefined {
	const observable = useMemo(() => {
		let result: Observable<Maybe<TableContainer>> | undefined
		if (id == null) {
			result = workflow?.output$
		} else {
			result = workflow?.read$(id)
		}
		return result ? result.pipe(map((t) => t?.table)) : from([existingTable])
	}, [workflow, id, existingTable])
	return useObservableState(observable, () => existingTable)
}
