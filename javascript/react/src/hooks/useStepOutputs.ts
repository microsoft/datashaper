/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@datashaper/workflow'
import { useMemo } from 'react'

/**
 * create a parallel array of output names for the steps
 *
 * @param graph - The graph manager
 * @returns
 */
export function useStepOutputs(
	graph: GraphManager,
	defaultOutputName?: (index: number) => string,
): Array<string | undefined> {
	const outputs = graph.outputDefinitions
	const steps = graph.steps

	return useMemo<Array<string | undefined>>(
		() =>
			steps
				.map(s => s.id)
				.map((id, index) => {
					const output = outputs.find(def => def.node === id)
					return output?.name ?? defaultOutputName?.(index)
				}),
		[steps, outputs, defaultOutputName],
	)
}
