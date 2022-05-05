/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { GraphManager, Step } from '@data-wrangling-components/core'
import type { ModalState } from '@data-wrangling-components/react-hooks'
import {
	useModalState,
	useStaticValue,
} from '@data-wrangling-components/react-hooks'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import isArray from 'lodash-es/isArray'
import { useCallback, useEffect, useState } from 'react'

//import { useCreateTableName } from '../hooks/common.js'

export function useOnDuplicateStep(
	graph: GraphManager,
	table?: ColumnTable,
	onSave?: (step: Step, index?: number) => void,
): (_step: Step) => void {
	//const createTableName = useCreateTableName(graph)
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
		[onSave, formattedColumnArgs, graph, table],
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

export function useOnDeleteStep(graph: GraphManager): () => void {
	return useCallback(
		(...args: any[]) => {
			console.log('TODO: delete', ...args, graph)
		},
		[graph],
	)
}

function useFormattedColumnArgWithCount(): (
	step: Step,
	columnNames: string[],
) => object {
	const createColumnName = useCreateColumnName()

	return useCallback(
		(step: Step, columnNames) => {
			let args = step.args as Record<string, unknown>
			Object.keys(args).forEach(x => {
				if (x === 'to' && !isArray(args[x])) {
					const newColumnName = createColumnName(args[x] as string, columnNames)
					args = { ...args, [x]: newColumnName }
				}
			})
			return args
		},
		[createColumnName],
	)
}

function useCreateColumnName(): (
	name: string,
	columnNames: string[],
) => string {
	const verifyColumnName = useCallback(
		(name: string, columnNames: string[]): boolean => {
			return columnNames.includes(name)
		},
		[],
	)

	return useCallback(
		(name: string, columnNames: string[]) => {
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
