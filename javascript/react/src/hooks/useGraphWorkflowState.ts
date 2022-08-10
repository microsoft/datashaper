/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Workflow } from '@datashaper/core'
import { useCallback, useState } from 'react'

export function useGraphWorkflowState(
	graph: GraphManager,
): [Workflow | undefined, (workflow: Workflow | undefined) => void] {
	const [workflow, setWorkflow] = useState<Workflow | undefined>(graph.workflow)
	return [
		workflow,
		useCallback(
			(w: Workflow | undefined) => {
				setWorkflow(w)
				graph.reset(w)
			},
			[setWorkflow, graph],
		),
	]
}
