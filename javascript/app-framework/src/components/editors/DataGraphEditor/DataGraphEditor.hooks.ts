/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataGraph } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useObservableState } from 'observable-hooks'

export function useNodesInputTable(
	resource: DataGraph,
): ColumnTable | undefined {
	const table = useObservableState(resource.nodesInput$, resource.nodesInput)
	return table?.table
}

export function useEdgesInputTable(
	resource: DataGraph,
): ColumnTable | undefined {
	const table = useObservableState(resource.edgesInput$, resource.edgesInput)
	return table?.table
}
