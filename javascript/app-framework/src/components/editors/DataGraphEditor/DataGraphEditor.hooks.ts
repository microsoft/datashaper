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
	const nodesInput = resource.nodesInput
	const table = useObservableState(nodesInput?.output$, nodesInput?.output)
	return table?.table
}

export function useEdgesInputTable(
	resource: DataGraph,
): ColumnTable | undefined {
	const edgesInput = resource.edgesInput
	const table = useObservableState(edgesInput?.output$, edgesInput?.output)
	return table?.table
}
