/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useObservable, useObservableState } from 'observable-hooks'
import { from, map } from 'rxjs'

export function useWorkflowDataTable(
	id: string | undefined,
	workflow?: Workflow,
	existingTable?: ColumnTable,
): ColumnTable | undefined {
	const observable = useObservable(
		() => workflow?.read$(id).pipe(map(t => t?.table)) ?? from([existingTable]),
		[workflow, id, existingTable],
	)
	return useObservableState(observable, () => existingTable)
}
