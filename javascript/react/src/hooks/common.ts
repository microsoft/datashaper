/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type { Step, Workflow } from '@datashaper/core'
import { GraphManager, nextOutputName, readStep } from '@datashaper/core'
import isArray from 'lodash-es/isArray.js'
import { useCallback, useEffect, useState } from 'react'

export function useGraphManager(
	workflow?: Workflow | undefined,
	inputs?: TableContainer[],
): GraphManager {
	const [graph, setGraph] = useState(
		() => new GraphManager(mapInputs(inputs), workflow),
	)

	// this effect should fire when a new workflow json is uploaded
	useEffect(
		function resetWorkflowWhenWorkflowChanges() {
			setGraph(new GraphManager(mapInputs(inputs), workflow))
		},
		[workflow, inputs],
	)

	return graph
}

function mapInputs(inputs?: TableContainer[]) {
	const _inputs = new Map()
	inputs?.forEach(i => _inputs.set(i.id, i))
	return _inputs
}

/**
 * Returns a hook to generate a new table name based on the given input e.g.
 * "join" could result in "join 1" or "join 2" depending on how many collisions
 *  occur.
 * @param graph - the graph manager
 * @returns a safe output name to use
 */
export function useCreateTableName(
	graph: GraphManager,
): (name: string) => string {
	return useCallback(
		(name: string): string => nextOutputName(name, graph.workflow),
		[graph],
	)
}

export function useFormattedColumnArg(): (
	stepArgs: unknown,
	newName?: string,
) => object {
	return useCallback((stepArgs: unknown, newName = 'New column') => {
		const args = stepArgs as Record<string, unknown>
		Object.keys(args).forEach(key => {
			if (key === 'to' && !isArray(args[key])) {
				args[key] = newName
			}
		})
		return args
	}, [])
}

export function useResetArgs(): (step: Step) => Step {
	return useCallback((step: Step) => {
		const template = readStep(step).args as Record<string, unknown>
		const args = step.args as Record<string, unknown>
		// rewrite through the proxy for each arg entry
		Object.keys(args).forEach(key => {
			args[key] = template[key]
		})
		return step
	}, [])
}
