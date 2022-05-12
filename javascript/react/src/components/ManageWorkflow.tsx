/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Step } from '@data-wrangling-components/core'
import { DialogConfirm } from '@essex/themed-components'
import { memo, useState } from 'react'

import { useGraphManager } from '../hooks/common.js'
import {
	useDeleteConfirm,
	useEditorTarget,
	useGraphSteps,
	useOnCreateStep,
	useOnDeleteStep,
	useOnDuplicateStep,
	useOnEditStep,
	useOnSaveStep,
	useStepOutputs,
	useTransformModalState,
} from './ManageWorkflow.hooks.js'
import { Container, modalStyles } from './ManageWorkflow.styles.js'
import type { ManageWorkflowProps } from './ManageWorkflow.types.js'
import { StepList } from './StepList.js'
import { TableTransformModal } from './TableTransformModal.js'

export const ManageWorkflow: React.FC<ManageWorkflowProps> = memo(
	function ManageWorkflow({
		workflow,
		inputs,
		table,
		onSelect,
		onUpdateOutput,
		...props
	}) {
		const graph = useGraphManager(workflow, inputs)

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

		//
		// Interaction Handlers
		//
		const onSave = useOnSaveStep(graph)
		const onDelete = useOnDeleteStep(graph)
		const {
			onClick: onDeleteClicked,
			toggle: toggleDeleteModalOpen,
			isOpen: isDeleteModalOpen,
			onConfirm: onConfirmDelete,
		} = useDeleteConfirm(onDelete)
		const onEditClicked = useOnEditStep(
			setSelectedStep,
			setSelectedStepIndex,
			showTransformModal,
		)
		const onCreate = useOnCreateStep(
			selectedStepIndex,
			onDismissTransformModal,
			onSave,
			onSelect,
		)
		const onDuplicateClicked = useOnDuplicateStep(graph, table, onSave)
		const { addStepButtonId, editorTarget } = useEditorTarget(selectedStepIndex)

		// create a parallel array of output names for the steps
		const outputs = useStepOutputs(graph)
		const graphSteps = useGraphSteps(graph, onUpdateOutput)

		return (
			<Container>
				<StepList
					onDeleteClicked={onDeleteClicked}
					onSelect={onSelect}
					onEditClicked={onEditClicked}
					steps={graphSteps}
					outputs={outputs}
					onDuplicateClicked={onDuplicateClicked}
					onStartNewStep={showTransformModal}
					buttonId={addStepButtonId}
				/>
				<div>
					{isTransformModalOpen ? (
						<TableTransformModal
							target={editorTarget}
							step={selectedStep}
							index={selectedStepIndex ?? graph.steps.length}
							onTransformRequested={onCreate}
							graph={graph}
							onDismiss={onDismissTransformModal}
							styles={modalStyles}
							{...props}
						/>
					) : null}

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
