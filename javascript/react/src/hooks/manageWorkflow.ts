/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { TableContainer } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type { Step } from '@datashaper/workflow'
import { cloneStep, Workflow } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect } from 'react'

import { useCreateTableName } from '../hooks/common.js'
import type { ModalState } from '../hooks/index.js'
import {
	useHandleStepOutputChanged,
	useHandleStepSave,
	useModalState,
} from '../hooks/index.js'

export function useOnDuplicateStep(
	workflow: Workflow,
	table?: ColumnTable,
	onSave?: (step: Step, output: string | undefined, index?: number) => void,
): (_step: Step) => void {
	const createTableName = useCreateTableName(workflow)

	return useCallback(
		(step: Step) => {
			const outputTable = table ?? workflow?.table(step.id)?.value?.table
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
 *
 * @param workflow - The workflow
 * @returns A callback to use when saving a step, either new or existing
 */
export function useOnUpdateStep(
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

export function useWorkflowOutputListener(
	workflow: Workflow,
	setOutput?: ((tables: TableContainer[]) => void) | undefined,
): void {
	useEffect(
		() =>
			setOutput &&
			workflow.onChange(() => {
				const outputs = (
					workflow.toArray().filter(t => !!t) as TableContainer[]
				).map(table => {
					if (!table.metadata) {
						table.metadata = introspect(table.table!, true)
					}
					return table
				})
				setOutput(outputs)
			}, true),
		[workflow, setOutput],
	)
}

export function useOnDeleteStep(workflow: Workflow): (index: number) => void {
	return useCallback(
		(index: number) => {
			workflow.removeStep(index)
		},
		[workflow],
	)
}

export function useWorkflowListener(
	workflow: Workflow,
	setWorkflow?: (workflow: Workflow) => void,
): void {
	useEffect(
		() =>
			setWorkflow &&
			workflow.onChange(() => setWorkflow(new Workflow(workflow.toSchema()))),
		[workflow, setWorkflow],
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
