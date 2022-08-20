/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphWorkflow } from '@datashaper/core'
import { useMemo } from 'react'

/**
 * create a parallel array of output names for the steps
 *
 * @param graph - The graph manager
 * @returns
 */
export function useStepOutputs(
	graph: GraphWorkflow,
	defaultOutputName?: (index: number) => string,
): Array<string | undefined> {
	return useMemo<Array<string | undefined>>(
		() =>
			graph.steps
				.map(s => s.id)
				.map((id, index) => {
					const output = graph.outputDefinitions.find(def => def.node === id)
					return output?.name ?? defaultOutputName?.(index)
				}),
		[graph, graph.steps, graph.outputDefinitions, defaultOutputName],
	)
}
