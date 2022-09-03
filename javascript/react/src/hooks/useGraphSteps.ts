/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step } from '@datashaper/workflow'
import { useEffect, useState } from 'react'

/**
 * Gets the graph processing steps
 * @param graph - the graph manager
 * @returns
 */
export function useGraphSteps(graph: GraphManager): Step[] {
	const [steps, setSteps] = useState<Step[]>(graph.steps)
	// listen for graph changes and update the steps
	useEffect(() => {
		setSteps(graph.steps)
		graph.onChange(() => setSteps(graph.steps))
	}, [graph, setSteps])
	return steps
}