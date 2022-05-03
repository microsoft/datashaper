/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Specification } from '@data-wrangling-components/core'
import { useBoolean } from '@fluentui/react-hooks'
import { useStaticValue } from '@data-wrangling-components/react-hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { DialogConfirm } from '@essex/themed-components'
import { memo } from 'react'
import styled from 'styled-components'

import type {
	ColumnTransformModalProps,
	TableTransformModalProps,
} from '../../index.js'
import {
	ColumnTransformModal,
	TableTransformModal,
	useDeleteConfirm,
} from '../../index.js'
import { StepsType } from '../../types.js'
import { StepsList } from '../index.js'
import { useOnEditStep } from './hooks/useOnEditStep.js'
import { useOnDuplicateStep } from './hooks/useOnDuplicateStep.js'

interface ManageWorkflowProps
	extends TableTransformModalProps,
		ColumnTransformModalProps {
	/**
	 *  Step save handler
	 */
	onSave?: (step: Step, index?: number | undefined) => void

	/**
	 * Step delete handler
	 */
	onDelete?: ((args: any) => void) | undefined

	/**
	 * The steps type
	 */
	type?: StepsType

	/**
	 * Table selection handler
	 */
	onSelect?: (name: string) => void

	/**
	 * The workflow specification
	 */
	workflow?: Specification
}

export const ManageWorkflow: React.FC<ManageWorkflowProps> = memo(
	function ManageWorkflow({
		onDelete,
		onSave,
		onSelect,
		graph,
		workflow,
		type = StepsType.Table,
		table,
		...props
	}) {
		const {
			onDeleteClicked,
			toggleDeleteModalOpen,
			isDeleteModalOpen,
			onConfirmDelete,
		} = useDeleteConfirm(onDelete)

		const [selectedStep, setSelectedStep] = useState<Step | undefined>()
		const [selectedStepIndex, setSelectedStepIndex] = useState<number>()

		const {
			isOpen: isTransformModalOpen,
			dismiss: onDismissTransformModal,
			show: showTransformModal,
		} = useTransformModalState(setSelectedStep, setSelectedStepIndex)

		const onEditClicked = useOnEditStep(
			setSelectedStep,
			setSelectedStepIndex,
			showTransformModal,
		)

		const onCreate = useCallback(
			(_step: Step) => {
				onSave?.(_step, selectedStepIndex)
				onDismissTransformModal()
			},
			[onSave, onDismissTransformModal, selectedStepIndex],
		)
		const onDuplicateClicked = useOnDuplicateStep(type, graph, table, onSave)
		const { addStepButtonId, editorTarget } = useEditorTarget(selectedStepIndex)

		return (
			<Container>
				<StepsList
					onDeleteClicked={onDeleteClicked}
					onSelect={onSelect}
					onEditClicked={onEditClicked}
					steps={workflow?.steps ?? []}
					onDuplicateClicked={onDuplicateClicked}
					onStartNewStep={showTransformModal}
					buttonId={addStepButtonId}
				/>

				<div>
					{type === StepsType.Table && isTransformModalOpen && (
						<TableTransformModal
							target={editorTarget}
							step={selectedStep}
							onTransformRequested={onCreate}
							isOpen={isTransformModalOpen}
							graph={graph}
							onDismiss={onDismissTransformModal}
							// HACK
							styles={{ calloutMain: { overflow: 'hidden' } } as any}
							{...props}
						/>
					)}

					{type === StepsType.Column && table && (
						<ColumnTransformModal
							step={selectedStep}
							table={table}
							onTransformRequested={onCreate}
							isOpen={isTransformModalOpen}
							onDismiss={onDismissTransformModal}
							{...props}
						/>
					)}

					{onDelete && (
						<DialogConfirm
							toggle={toggleDeleteModalOpen}
							title="Are you sure you want to delete this step?"
							subText={
								type === StepsType.Table
									? 'You will also lose any table transformations made after this step.'
									: ''
							}
							show={isDeleteModalOpen}
							onConfirm={onConfirmDelete}
						/>
					)}
				</div>
			</Container>
		)
	},
)

const Container = styled.div`
	width: 97%;
	display: grid;
`

/**
 *
 * @param setSelectedStep - A mutator for the selected step
 * @param setSelectedStepIndex - A mutator for the selected step indexw
 * @returns An object containing the isOpen state, and show/hide callbacks
 */
function useTransformModalState(
	setSelectedStep: (step: Step | undefined) => void,
	setSelectedStepIndex: (index: number | undefined) => void,
): {
	isOpen: boolean
	show: () => void
	dismiss: () => void
} {
	const [isOpen, { setTrue: show, setFalse: hideTransformModal }] =
		useBoolean(false)

	const dismiss = useCallback(() => {
		hideTransformModal()
		setSelectedStep(undefined)
		setSelectedStepIndex(undefined)
	}, [setSelectedStep, setSelectedStepIndex, hideTransformModal])

	return useMemo(
		() => ({
			isOpen,
			show,
			dismiss,
		}),
		[isOpen, show, dismiss],
	)
}

function useEditorTarget(selectedStepIndex: number | undefined): {
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
