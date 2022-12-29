/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableCommandsProps } from '@datashaper/react'
import { KnownProfile } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Maybe, Step, TableBundle, Workflow } from '@datashaper/workflow'
import type { IColumn } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { useCallback, useMemo, useState } from 'react'
import type { Observable } from 'rxjs'

import { useCommandBarStyles, useTableHeaderColors } from '../styles.js'

export function useSelectedTable(
	bundle: TableBundle,
	selectedTableId: string | undefined,
): TableContainer | undefined {
	const workflow = useTableBundleWorkflow(bundle)
	const observed$ = useMemo<Observable<Maybe<TableContainer>>>(() => {
		if (bundle.name === selectedTableId && bundle?.input != null) {
			// if we select the original table name, use the workflow default input
			return bundle.input.output$
		} else if (selectedTableId == null) {
			// If the selected table id is not defined, use the default tablebundle output
			return bundle.output$
		} else {
			// try to use the given table name to read step output, otherwise use the default output
			const table = workflow?.read$(selectedTableId)
			const defaultOutput = bundle.output$
			return table ?? defaultOutput
		}
	}, [bundle, selectedTableId, workflow])
	return useObservableState(observed$, () => undefined)
}

export function useColumnState(): [
	string | undefined,
	(ev?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => void,
] {
	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()
	const onColumnClick = useCallback(
		(_?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => {
			setSelectedColumn(prev =>
				prev === column?.name ? undefined : column?.name,
			)
		},
		[setSelectedColumn],
	)
	return [selectedColumn, onColumnClick]
}

export function useTableName(
	table: TableBundle,
	selectedTableId: string | undefined,
): string {
	const workflow = useTableBundleWorkflow(table)
	return useMemo(() => {
		let name: string | undefined
		if (workflow != null) {
			const stepIndex = workflow.steps.findIndex(x => x.id === selectedTableId)
			// if the step index is the final step, use the default datatable name
			if (stepIndex < workflow.steps.length - 1) {
				const step = workflow.steps[stepIndex]
				name = (step?.id || step?.verb)?.toLocaleUpperCase()
			}
		}
		return name || table.name
	}, [workflow, selectedTableId, table.name])
}

function useTableBundleWorkflow(table: TableBundle): Workflow | undefined {
	return useMemo(
		() =>
			table
				.getSourcesWithProfile(KnownProfile.Workflow)
				.find(t => !!t) as Workflow,

		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[table, table.sources],
	)
}

/**
 * Creates a callback that may be used to delete steps by index
 * @param workflow - The dat workflow
 * @returns A callback that may be used to delete steps by index
 */
export function useOnDeleteStep(workflow: Workflow): (index: number) => void {
	return useCallback((index: number) => workflow.removeStep(index), [workflow])
}

/**
 * Get a function to call when a step is created
 * @param save - The save function to call when the step is created
 * @param selectOutput - A function to select the output after the step is created
 * @param dismissModal - The function used to dismill the modal
 * @returns
 */
export function useOnCreateStep(
	save: (step: Step, index: number | undefined) => void,
	selectOutput: undefined | ((name: string) => void),
	dismissModal?: () => void,
): (step: Step, output: string | undefined, index: number | undefined) => void {
	return useCallback(
		(step: Step, output: string | undefined, index: number | undefined) => {
			save(step, index)
			dismissModal?.()
			if (output) selectOutput?.(output)
		},
		[save, dismissModal, selectOutput],
	)
}

/**
 * Creates a callback that may be used to save a step
 * @param workflow - The workflow
 * @returns A callback to use when saving a step, either new or existing
 */
export function useOnSaveStep(
	workflow: Workflow,
): (step: Step, index: number | undefined) => void {
	const updateStep = useOnStepSave(workflow)
	const updateStepOutput = useOnStepOutputChanged(workflow)

	return useCallback(
		(step: Step, index: number | undefined) => {
			const stepResult = updateStep(step, index)
			updateStepOutput(stepResult)
		},
		[updateStepOutput, updateStep],
	)
}
function useOnStepSave(
	workflow: Workflow,
): (step: Step, index: number | undefined) => Step {
	return useCallback(
		(step: Step, index: number | undefined) => {
			const isExistingStep =
				index != null && workflow.length > 0 && index < workflow.length
			return isExistingStep
				? workflow.updateStep(step, index as number)
				: workflow.addStep(step)
		},
		[workflow],
	)
}

/**
 * This hooks handles managing a step's output within the workflow. This hook assumes
 * that each step will have a single output, which will become an invariant we expand upon
 * in the future.
 *
 * @param workflow - the workflow instance
 * @returns A callback to use when the step output changes
 */
function useOnStepOutputChanged(workflow: Workflow): (step: Step) => void {
	return useCallback(
		(step: Step) => {
			// remove any existing output
			if (workflow.hasOutputName(step.id)) {
				workflow.removeOutput(step.id)
			}

			// if the output is defined, add it
			workflow.addOutput(step.id)
		},
		[workflow],
	)
}

export function useTableCommandProps(): Partial<TableCommandsProps> {
	const colors = useTableHeaderColors()
	const styles = useCommandBarStyles()
	return useMemo(
		() => ({
			background: colors.background,
			commandBarProps: {
				styles,
			},
		}),
		[colors, styles],
	)
}
