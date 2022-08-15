/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step } from '@datashaper/core'
import { useCallback } from 'react'

/**
 * This hooks handles managing a step's output within the graph manager. This hook assumes
 * that each step will have a single output, which will become an invariant we expand upon
 * in the future.
 *
 * @param graph - the graph manager
 * @returns A callback to use when the step output changes
 */
export function useHandleStepOutputChanged(
	graph: GraphManager,
): (step: Step, output: string | undefined) => void {
	return useCallback(
		(step: Step, output: string | undefined) => {
			// remove any existing output
			const spec = graph.outputDefinitions.find(def => def.node === step.id)
			if (spec) {
				graph.removeOutput(spec.name)
			}

			// if the output is defined, add it
			if (output) {
				graph.addOutput({ node: step.id, name: output })
			}
		},
		[graph],
	)
}
