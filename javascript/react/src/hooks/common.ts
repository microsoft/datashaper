/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Step, Workflow as WorkflowJson } from '@datashaper/workflow'
import { readStep,Workflow } from '@datashaper/workflow'
import isArray from 'lodash-es/isArray.js'
import { useCallback, useEffect, useState } from 'react'

export function useGraphManager(
	workflow?: WorkflowJson | undefined,
	inputs?: TableContainer[],
): Workflow {
	const [graph, setGraph] = useState(
		() => new Workflow(workflow?.toJsonObject()),
	)

	// this effect should fire when a new workflow json is uploaded
	useEffect(
		function resetWorkflowWhenWorkflowChanges() {
			setGraph(new Workflow(workflow?.toJsonObject()))
		},
		[workflow],
	)

	useEffect(
		function syncDataTablesWhenInputsChange() {
			if (inputs) {
				graph.addInputTables(inputs)
			}
		},
		[graph, inputs],
	)

	return graph
}

/**
 * Returns a hook to generate a new table name based on the given input e.g.
 * "join" could result in "join 1" or "join 2" depending on how many collisions
 *  occur.
 * @param graph - the graph manager
 * @returns a safe output name to use
 */
export function useCreateTableId(graph: Workflow): (name: string) => string {
	return useCallback(
		(name: string): string => graph.suggestOutputName(name),
		[graph],
	)
}
/**
 * Returns a hook to generate a new table name based on the given input e.g.
 * "join" could result in "join 1" or "join 2" depending on how many collisions
 *  occur.
 * @param graph - the graph manager
 * @returns a safe output name to use
 */
export function useCreateTableName(
	workflow: WorkflowJson,
): (name: string) => string {
	return useCallback(
		(name: string): string => workflow.suggestOutputName(name),
		[workflow],
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
