/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useMemo, useState } from 'react'

import { useWorkflow } from '../../../../hooks/useFormattedColumnArg.js'
export function useParameters(inputs: ColumnTable[]): {
	workflow: Workflow
} {
	// state for the input tables
	const inp = useMemo(
		() => inputs.map((t, i) => container(`table-${i}`, t)),
		[inputs],
	)
	const [wf] = useState<Workflow>(new Workflow())
	// workflow steps/output
	const workflow = useWorkflow(wf, inp)
	return {
		workflow,
	}
}
