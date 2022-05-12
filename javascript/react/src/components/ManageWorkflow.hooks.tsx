/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { GraphManager, Step } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash-es/cloneDeep'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { ModalState } from '../hooks/index.js'
import {
	useCreateTableName,
	useModalState,
	useStaticValue,
} from '../hooks/index.js'

export function useOnDuplicateStep(
	graph: GraphManager,
	table?: ColumnTable,
	onSave?: (step: Step, output: string | undefined, ndex?: number) => void,
): (_step: Step) => void {
	const createTableName = useCreateTableName(graph)
	const argsDuplicator = useArgsDuplicator()

	return useCallback(
		(step: Step) => {
			const outputTable = table ?? graph?.latestForNodeId(step.id)?.table
			onSave?.(
				{
					...step,
					id: undefined as any,
					args: argsDuplicator(step, outputTable?.columnNames()),
					input: cloneDeep(step.input),
				},
				createTableName(graph.outputNameForNode(step.id) ?? step.id),
			)
		},
		[onSave, argsDuplicator, graph, table, createTableName],
	)
}

/**
 * A hook to get the onEditStep callback
 *
 * @param setStep - The step setter
 * @param setStepIndex - The step-index setter
 * @param showTableModal - A callback to show the table modas
 * @returns
 */
export function useOnEditStep(
	setStep: (step: Step) => void,
	setStepIndex: (index: number) => void,
	showTableModal: () => void,
): (step: Step, index: number) => void {
	return useCallback(
		(step: Step, index: number) => {
			setStep(step)
			setStepIndex(index)
			showTableModal()
		},
		[setStep, showTableModal, setStepIndex],
	)
}

/**
 *
 * @param graph - The graph manager
 * @returns A callback to use when saving a step, either new or existing
 */
export function useOnSaveStep(
	graph: GraphManager,
): (step: Step, output: string | undefined, index: number | undefined) => void {
	return useCallback(
		(step: Step, output: string | undefined, index: number | undefined) => {
			//
			// If the step index is already present, update the existing step
			//
			const isExistingStep =
				index != null && graph.numSteps > 0 && index < graph.numSteps
			const stepResult = isExistingStep
				? graph.reconfigureStep(index as number, step)
				: graph.addStep(step)

			//
			// Set or unset the output
			//
			const existingOutput = graph.outputDefinitions.find(
				d => d.node === stepResult.id,
			)
			if (output) {
				graph.addOutput({
					name: output,
					node: stepResult.id,
				})
			} else if (existingOutput) {
				graph.removeOutput(existingOutput.name)
			}
		},
		[graph],
	)
}

/**
 * A hook to manage state for showing the the step transformation modal
 *
 * @param setSelectedStep - A mutator for the selected step
 * @param setSelectedStepIndex - A mutator for the selected step indexw
 * @returns An object containing the isOpen state, and show/hide callbacks
 */
export function useTransformModalState(
	setSelectedStep: (step: Step | undefined) => void,
	setSelectedStepIndex: (index: number | undefined) => void,
): ModalState {
	const onDismiss = useCallback(() => {
		setSelectedStep(undefined)
		setSelectedStepIndex(undefined)
	}, [setSelectedStep, setSelectedStepIndex])
	return useModalState(undefined, onDismiss)
}

export function useEditorTarget(selectedStepIndex: number | undefined): {
	editorTarget: string
	addStepButtonId: string
} {
	const addStepButtonId = useStaticValue(
		`button-${Math.round(Math.random() * 3)}`,
	)
	const [editorTarget, setEditorTarget] = useState<string>(addStepButtonId)
	useEffect(() => {
		if (selectedStepIndex !== undefined) {
			setEditorTarget(`.step-card-${selectedStepIndex}`)
		} else {
			setEditorTarget(`#${addStepButtonId}`)
		}
	}, [addStepButtonId, selectedStepIndex])

	return {
		editorTarget,
		addStepButtonId,
	}
}

export function useOnDeleteStep(graph: GraphManager): (index: number) => void {
	return useCallback(
		(index: number) => {
			graph.removeStep(index)
		},
		[graph],
	)
}

function useArgsDuplicator(): (
	step: Step,
	columnNames: string[] | undefined,
) => object {
	const createColumnName = useCreateColumnName()
	return useCallback(
		(step: Step, columnNames: string[] | undefined) => {
			const args = cloneDeep(step.args) as Record<string, unknown>

			// if there's a single-column to-field, find a unique name for it
			if (args['to'] && typeof args['to'] === 'string') {
				args['to'] = createColumnName(args['to'] as string, columnNames)
			}
			return args
		},
		[createColumnName],
	)
}

function useCreateColumnName(): (
	name: string,
	columnNames: string[] | undefined,
) => string {
	const verifyColumnName = useCallback(
		(name: string, columnNames: string[] | undefined): boolean => {
			return columnNames?.includes(name) ?? false
		},
		[],
	)

	return useCallback(
		(name: string, columnNames: string[] | undefined) => {
			const originalName = name.replace(/( \(\d+\))/, '')
			let derivedName = originalName

			let count = 1
			while (verifyColumnName(derivedName, columnNames)) {
				derivedName = `${originalName} (${count})`
				count++
			}
			return derivedName
		},
		[verifyColumnName],
	)
}

export function useDeleteConfirm(onDelete?: (args: any) => void): {
	isOpen: boolean
	toggle: () => void
	onClick: (args: any) => void
	onConfirm: () => void
} {
	const { isOpen, show, hide, toggle } = useModalState(undefined, undefined)
	const [deleteArg, setDeleteArg] = useState<any>()

	const onDeleteClicked = useCallback(
		(args: any) => {
			setDeleteArg(args)
			show()
		},
		[show, setDeleteArg],
	)

	const onConfirmDelete = useCallback(() => {
		onDelete?.(deleteArg)
		hide()
	}, [hide, deleteArg, onDelete])

	return {
		isOpen,
		toggle,
		onConfirm: onConfirmDelete,
		onClick: onDeleteClicked,
	}
}

export function useGraphChangeListener(
	graph: GraphManager,
	setGraphSteps: (steps: Step[]) => void,
	onUpdateOutput?: (tables: TableContainer[]) => void,
): void {
	useEffect(
		function emitCurrentTableList() {
			return graph.onChange(() => {
				setGraphSteps(graph.steps)
				onUpdateOutput?.(graph.toList().filter(t => !!t) as TableContainer[])
			})
		},
		[graph, onUpdateOutput],
	)
}

export function useStepOutputs(graph: GraphManager): Array<string | undefined> {
	return useMemo(
		() =>
			graph.steps
				.map(s => s.id)
				.map(id => {
					const output = graph.outputDefinitions.find(def => def.node === id)
					return output?.name
				}),
		[graph.steps, graph.outputDefinitions],
	)
}
