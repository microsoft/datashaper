/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, GraphManager } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import {
	useStaticValue,
	useModalState,
	ModalState,
} from '@data-wrangling-components/react-hooks'
import { useCallback, useState, useEffect } from 'react'

import {
	useCreateTableName,
	useFormattedColumnArgWithCount,
} from '../../common/index.js'

export function useOnDuplicateStep(
	graph?: GraphManager,
	table?: ColumnTable,
	onSave?: (step: Step, index?: number) => void,
): (_step: Step) => void {
	const createTableName = useCreateTableName(graph)
	const formattedColumnArgs = useFormattedColumnArgWithCount()

	return useCallback(
		(_step: Step) => {
			// const _tableName = createTableName(_step.id)

			const outputTable = graph ? graph.latest(_step.id)?.table : table
			const formattedArgs = formattedColumnArgs(
				_step,
				outputTable?.columnNames() ?? [],
			)
			const newStep = {
				..._step,
				args: formattedArgs,
				inputs: { source: { node: _step.id } },
			}
			onSave?.(newStep)
		},
		[onSave, createTableName, formattedColumnArgs, graph, table],
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
): (step: Step, index: number | undefined) => void {
	return useCallback(
		(step: Step, index: number | undefined) => {
			if (index != null && graph.numSteps > 0 && index < graph.numSteps) {
				graph.reconfigureStep(index, step)
			} else {
				graph.addStep(step)
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

export function useOnDeleteStep(graph: GraphManager) {
	return useCallback(
		(...args: any[]) => {
			console.log('TODO: delete', ...args)
		},
		[graph],
	)
}
