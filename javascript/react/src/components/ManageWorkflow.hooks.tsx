/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { TableContainer } from '@datashaper/tables'
import type { Step } from '@datashaper/workflow'
import { cloneStep, Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'

import { useCreateTableName } from '../hooks/common.js'
import type { ModalState } from '../hooks/index.js'
import {
	useHandleStepOutputChanged,
	useHandleStepSave,
	useModalState,
	useStaticValue,
} from '../hooks/index.js'

export function useOnDuplicateStep(
	workflow: Workflow,
	table?: ColumnTable,
	onSave?: (step: Step, output: string | undefined, index?: number) => void,
): (_step: Step) => void {
	const createTableName = useCreateTableName(workflow)

	return useCallback(
		(step: Step) => {
			const outputTable = table ?? workflow?.latestOutputForNode(step.id)?.table
			const clonedStep = cloneStep(step, outputTable?.columnNames())
			clonedStep.id = ''
			onSave?.(
				clonedStep,
				createTableName(workflow.outputNameForNode(step.id) ?? step.id),
			)
		},
		[onSave, workflow, table, createTableName],
	)
}

/**
 * A hook to get the onEditStep callback
 *
 * @param setStep - The step setter
 * @param setStepIndex - The step-index setter
 * @param showTableModal - A callback to show the table modal
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

export function useOnCreateStep(
	save: (
		step: Step,
		output: string | undefined,
		index: number | undefined,
	) => void,
	selectOutput: undefined | ((name: string) => void),
	dismissModal?: () => void,
): (step: Step, output: string | undefined, index: number | undefined) => void {
	return useCallback(
		(step: Step, output: string | undefined, index: number | undefined) => {
			save(step, output, index)
			dismissModal?.()
			if (output) selectOutput?.(output)
		},
		[save, dismissModal, selectOutput],
	)
}

/**
 *
 * @param workflow - The workflow
 * @returns A callback to use when saving a step, either new or existing
 */
export function useOnSaveStep(
	workflow: Workflow,
): (step: Step, output: string | undefined, index: number | undefined) => void {
	const updateStep = useHandleStepSave(workflow)
	const updateStepOutput = useHandleStepOutputChanged(workflow)

	return useCallback(
		(step: Step, output: string | undefined, index: number | undefined) => {
			const stepResult = updateStep(step, index)
			updateStepOutput(stepResult, output)
		},
		[updateStepOutput, updateStep],
	)
}

/**
 * A hook to manage state for showing the the step transformation modal
 *
 * @param setStep - A mutator for the selected step
 * @param setStepIndex - A mutator for the selected step indexw
 * @returns An object containing the isOpen state, and show/hide callbacks
 */
export function useTransformModalState(
	setStep: (step: Step | undefined) => void,
	setStepIndex: (index: number | undefined) => void,
): ModalState {
	const onDismiss = useCallback(() => {
		setStep(undefined)
		setStepIndex(undefined)
	}, [setStep, setStepIndex])
	return useModalState(undefined, onDismiss)
}

export function useEditorTarget(stepIndex: number | undefined): {
	editorTarget: string
	addStepButtonId: string
} {
	const addStepButtonId = useStaticValue(
		`button-${Math.round(Math.random() * 3)}`,
	)
	const [editorTarget, setEditorTarget] = useState<string>(addStepButtonId)
	useEffect(() => {
		if (stepIndex !== undefined) {
			setEditorTarget(`.step-card-${stepIndex}`)
		} else {
			setEditorTarget(`#${addStepButtonId}`)
		}
	}, [addStepButtonId, stepIndex])

	return {
		editorTarget,
		addStepButtonId,
	}
}

export function useOnDeleteStep(workflow: Workflow): (index: number) => void {
	return useCallback(
		(index: number) => {
			workflow.removeStep(index)
		},
		[workflow],
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

export function useWorkflowOutputListener(
	workflow: Workflow,
	setOutput?: ((tables: TableContainer[]) => void) | undefined,
): void {
	useEffect(
		() =>
			setOutput &&
			workflow.onChange(
				() =>
					setOutput(workflow.toArray().filter(t => !!t) as TableContainer[]),
				true,
			),
		[workflow, setOutput],
	)
}

export function useWorkflowListener(
	workflow: Workflow,
	setWorkflow?: (workflow: Workflow) => void,
): void {
	useEffect(
		() =>
			setWorkflow &&
			workflow.onChange(() =>
				setWorkflow(new Workflow(workflow.toJsonObject())),
			),
		[workflow, setWorkflow],
	)
}
