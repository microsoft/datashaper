/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	GraphManager,
	Step,
	Verb,
	Workflow,
} from '@data-wrangling-components/core'
import { readStep } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { container } from '@essex/arquero'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useMemo, useState } from 'react'

const identity = (d: any) => d

// default parsers to keep these columns as strings
const parse = {
	ID: identity,
	Group: identity,
}

/**
 * Gets the graph processing steps
 * @param graph - the graph manager
 * @returns
 */
export function useSteps(graph: GraphManager): Step[] {
	const [steps, setSteps] = useState<Step[]>([])
	// listen for graph changes and update the steps
	useEffect(
		() => graph.onChange(() => setSteps(graph.steps)),
		[graph, setSteps],
	)
	return steps
}

export function useWorkflowState(
	graph: GraphManager,
): [Workflow | undefined, (workflow: Workflow | undefined) => void] {
	const [exampleSpec, setExampleSpec] = useState<Workflow | undefined>()
	return [
		exampleSpec,
		useCallback(
			(spec: Workflow | undefined) => {
				setExampleSpec(spec)
				graph.reset(spec)
			},
			[setExampleSpec, graph],
		),
	]
}

export function useWorkflowDownloadUrl(workflow: Workflow | undefined): string {
	const [serialized, setSerialized] = useState<Blob>()
	useEffect(() => {
		if (workflow != null) {
			const serialize = (): Blob =>
				new Blob([JSON.stringify(workflow.toJsonObject(), null, 4)])

			setSerialized(serialize())
			return workflow.onChange(() => setSerialized(serialize()))
		}
	}, [workflow])

	return useMemo(
		() => (serialized ? URL.createObjectURL(serialized) : ''),
		[serialized],
	)
}

/**
 *
 * @param graph - the graph manager
 * @returns
 */
export function useCreateStepHandler(
	graph: GraphManager,
): (verb: Verb) => void {
	return useCallback(
		(verb: Verb) => {
			const newStep = readStep({ verb })
			graph.addStep(newStep)
		},
		[graph],
	)
}

export function useChangeStepHandler(
	graph: GraphManager,
): (step: Step, index: number) => void {
	return useCallback(
		(step: Step, index: number) => {
			graph.reconfigureStep(index, step)
		},
		[graph],
	)
}

export function useHandleStepOutputChanged(
	graph: GraphManager,
): (step: Step, output: string | undefined) => void {
	return useCallback(
		(step: Step, output: string | undefined) => {
			if (output) {
				graph.addOutput({ node: step.id, name: output })
			} else {
				const spec = graph.outputDefinitions.find(def => def.node === step.id)
				if (spec) {
					graph.removeOutput(spec.name)
				}
			}
		},
		[graph],
	)
}

/**
 * Load the initial input tables
 * @param autoType - Whether to auto-type the columns when reading the file
 * @returns A set of table containers representing the initial dataset
 */
export function useInputTables(autoType = false): TableContainer[] {
	const [tables, setTables] = useState<TableContainer[]>([])

	useEffect(() => {
		const fn = async () => {
			const promises = [
				`data/companies.csv`,
				`data/companies2.csv`,
				`data/products.csv`,
				'data/stocks.csv',
			].map(async name => {
				const data = await readCsvFile(name, autoType)
				return container(name, data)
			})
			const loadedTables = await Promise.all(promises)
			setTables(loadedTables)
		}
		void fn()
	}, [autoType])

	return tables
}

/**
 * Gets a callback for handling adding files to the graph
 * @param graph - the input graph
 * @returns The graph and a callback to update the input tables
 */
export function useAddFilesHandler(
	graph: GraphManager,
): (loaded: TableContainer[]) => void {
	// add any dropped files to the inputs
	return useCallback(
		(loaded: TableContainer[]) => {
			loaded.forEach(table => graph.addInput(table))
		},
		[graph],
	)
}

function readCsvFile(name: string, autoType: boolean): Promise<ColumnTable> {
	return loadCSV(name, {
		parse,
		autoMax: 100000,
		autoType,
	})
}

/**
 * create a parallel array of output names for the steps
 *
 * @param graph The graph manager
 * @returns
 */
export function useStepOutputs(graph: GraphManager): string[] {
	return useMemo<string[]>(
		() =>
			graph.steps
				.map(s => s.id)
				.map((id, index) => {
					const output = graph.outputDefinitions.find(def => def.node === id)
					return output?.name ?? `step-${index + 1}`
				}),
		[graph.steps, graph.outputDefinitions],
	)
}
