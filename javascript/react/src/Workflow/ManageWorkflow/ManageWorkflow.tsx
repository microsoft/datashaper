/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	Specification,
	StepInput,
} from '@data-wrangling-components/core'
import { readSteps } from '@data-wrangling-components/core'
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
import { TableTransformModal, useDeleteConfirm } from '../../index.js'
import { StepsList } from '../index.js'
import { useOnEditStep } from './hooks/useOnEditStep.js'
import { useOnDuplicateStep } from './hooks/useOnDuplicateStep.js'

interface ManageWorkflowProps
	extends TableTransformModalProps,
		ColumnTransformModalProps {
	/**
	 * The workflow specification
	 */
	workflow?: Specification

	/**
	 *  Step save handler
	 */
	onUpdate?: (workflow: Specification) => void

	/**
	 * Table selection handler
	 */
	onSelect?: (name: string) => void
}

export const ManageWorkflow: React.FC<ManageWorkflowProps> = memo(
	function ManageWorkflow({ onSelect, graph, workflow, table, ...props }) {
		const onSave = (...args: any[]) => {
			console.log('TODO: Save step')
		}
		const onDelete = (...args: any[]) => {
			console.log('TODO: delete step')
		}
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
		const onDuplicateClicked = useOnDuplicateStep(graph, table, onSave)
		const { addStepButtonId, editorTarget } = useEditorTarget(selectedStepIndex)
		const stepList = useMemo(
			() => readSteps((workflow?.steps as StepInput[]) ?? []),
			[workflow?.steps],
		)

		return (
			<Container>
				<StepsList
					onDeleteClicked={onDeleteClicked}
					onSelect={onSelect}
					onEditClicked={onEditClicked}
					steps={stepList}
					onDuplicateClicked={onDuplicateClicked}
					onStartNewStep={showTransformModal}
					buttonId={addStepButtonId}
				/>

				<div>
					{isTransformModalOpen && (
						<TableTransformModal
							target={editorTarget}
							step={selectedStep}
							onTransformRequested={onCreate}
							graph={graph}
							onDismiss={onDismissTransformModal}
							// HACK
							styles={{ calloutMain: { overflow: 'hidden' } } as any}
							{...props}
						/>
					)}

					<DialogConfirm
						toggle={toggleDeleteModalOpen}
						title="Are you sure you want to delete this step?"
						subText={
							'You will also lose any table transformations made after this step.'
						}
						show={isDeleteModalOpen}
						onConfirm={onConfirmDelete}
					/>
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
