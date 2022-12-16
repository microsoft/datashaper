/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { container, introspect } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { EMPTY_OBJECT } from '../../../../empty.js'

export function useWorkflowDownloadUrl(workflow: Workflow | undefined): string {
	const [serialized, setSerialized] = useState<Blob>(
		new Blob([workflowToJson(workflow)]),
	)
	useEffect(() => {
		return workflow?.onChange(() =>
			setSerialized(new Blob([workflowToJson(workflow)])),
		)
	}, [workflow])

	return useMemo(() => URL.createObjectURL(serialized), [serialized])
}

function workflowToJson(workflow: Workflow | undefined) {
	const o = workflow?.toSchema() ?? EMPTY_OBJECT
	return JSON.stringify(o, null, 4)
}

/**
 *
 * @param workflow - the workflow instance
 * @returns
 */
export function useCreateStepHandler(workflow: Workflow): (verb: Verb) => void {
	const saveStep = useCallback(
		(step: Step, index: number) => workflow.updateStep(step, index),
		[workflow],
	)
	return useCallback(
		(verb: Verb) => saveStep({ verb } as Step, workflow.length),
		[saveStep, workflow],
	)
}

/**
 * Load the initial input tables
 * @param autoType - Whether to auto-type the columns when reading the file
 * @returns A set of table containers representing the initial dataset
 */
export function useInputTables(inputs: TableContainer[]): TableContainer[] {
	const [tables, setTables] = useState<TableContainer[]>([])

	useEffect(() => {
		if (inputs) {
			const withMeta = inputs.map(table => {
				const meta = introspect(table.table!, true)
				return container(table.id, table.table, meta)
			})
			setTables(withMeta)
		}
	}, [inputs])

	return tables
}

/**
 * Gets a callback for handling adding files to the graph
 * @param workflow - the input graph
 * @returns The graph and a callback to update the input tables
 */
export function useAddFilesHandler(
	workflow: Workflow,
): (loaded: TableContainer[]) => void {
	// add any dropped files to the inputs
	return useCallback(
		(loaded: TableContainer[]) => {
			loaded.forEach(table => workflow.addInputTable(table))
		},
		[workflow],
	)
}
