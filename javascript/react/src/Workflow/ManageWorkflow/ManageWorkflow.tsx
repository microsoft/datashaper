/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Specification } from '@data-wrangling-components/core'
import { useCallback, useState } from 'react'

import { DialogConfirm } from '@essex/themed-components'
import { memo } from 'react'
import styled from 'styled-components'

import type {
	ColumnTransformModalProps,
	TableTransformModalProps,
} from '../../index.js'
import { TableTransformModal, useDeleteConfirm } from '../../index.js'
import { StepsList } from '../index.js'
import {
	useOnEditStep,
	useOnDuplicateStep,
	useOnSaveStep,
	useOnDeleteStep,
	useTransformModalState,
	useEditorTarget,
} from './ManageWorkflow.hooks.js'

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
		//
		// Selected Step/Index State for the component
		//
		const [selectedStep, setSelectedStep] = useState<Step | undefined>()
		const [selectedStepIndex, setSelectedStepIndex] = useState<number>()

		//
		// Modal view-state
		//
		const {
			isOpen: isTransformModalOpen,
			hide: onDismissTransformModal,
			show: showTransformModal,
		} = useTransformModalState(setSelectedStep, setSelectedStepIndex)

		// Interaction Handlers
		const onSave = useOnSaveStep(graph)
		const onDelete = useOnDeleteStep(graph)
		const {
			onDeleteClicked,
			toggleDeleteModalOpen,
			isDeleteModalOpen,
			onConfirmDelete,
		} = useDeleteConfirm(onDelete)
		const onEditClicked = useOnEditStep(
			setSelectedStep,
			setSelectedStepIndex,
			showTransformModal,
		)
		const onCreate = useCallback(
			(step: Step) => {
				onSave(step, selectedStepIndex)
				onDismissTransformModal()
			},
			[onSave, onDismissTransformModal, selectedStepIndex],
		)
		const onDuplicateClicked = useOnDuplicateStep(graph, table, onSave)
		const { addStepButtonId, editorTarget } = useEditorTarget(selectedStepIndex)
		const stepList = graph.steps

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
