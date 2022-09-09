/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Step } from '@datashaper/workflow'
import { readStep, Workflow } from '@datashaper/workflow'
import isArray from 'lodash-es/isArray.js'
import { useCallback, useEffect, useState } from 'react'

export function useWorkflow(
	input?: Workflow | undefined,
	inputs?: TableContainer[],
): Workflow {
	const [workflow, setWorkflow] = useState(
		() => new Workflow(input?.toJsonObject()),
	)

	// this effect should fire when a new workflow json is uploaded
	useEffect(
		function resetWorkflowWhenWorkflowChanges() {
			setWorkflow(new Workflow(input?.toJsonObject()))
		},
		[input],
	)

	useEffect(
		function syncDataTablesWhenInputsChange() {
			if (inputs) {
				workflow.addInputTables(inputs)
			}
		},
		[workflow, inputs],
	)

	return workflow
}

/**
 * Returns a hook to generate a new table name based on the given input e.g.
 * "join" could result in "join 1" or "join 2" depending on how many collisions
 *  occur.
 * @param workflow - the workflow instance
 * @returns a safe output name to use
 */
export function useCreateTableId(workflow: Workflow): (name: string) => string {
	return useCallback(
		(name: string): string => workflow.suggestOutputName(name),
		[workflow],
	)
}
/**
 * Returns a hook to generate a new table name based on the given input e.g.
 * "join" could result in "join 1" or "join 2" depending on how many collisions
 *  occur.
 * @param workflow - the workflow instance
 * @returns a safe output name to use
 */
export function useCreateTableName(
	workflow: Workflow,
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
