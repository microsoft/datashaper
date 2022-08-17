/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { GraphManager, Step } from '@datashaper/core'
import { NodeInput } from '@datashaper/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { useDataTable } from '../hooks/index.js'

export function useStepDataTable(
	step: Step,
	graph: GraphManager | undefined,
	input?: string | undefined,
	table?: ColumnTable | undefined,
): ColumnTable | undefined {
	return useDataTable(input || step.input[NodeInput.Source]?.node, graph, table)
}
