/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Step } from '@datashaper/core'
import { DialogConfirm } from '@essex/themed-components'
import { memo, useState } from 'react'

import {
	useGraphSteps,
	useGraphWorkflow,
	useStepOutputs,
} from '../hooks/index.js'
import {
	useDeleteConfirm,
	useEditorTarget,
	useGraphOutputListener,
	useGraphWorkflowListener,
	useOnCreateStep,
	useOnDeleteStep,
	useOnDuplicateStep,
	useOnEditStep,
	useOnSaveStep,
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
		onUpdateWorkflow,
		...props
	}) {
		const graph = useGraphWorkflow(workflow, inputs)

		// Selected Step/Index State for the component
		const [step, setStep] = useState<Step | undefined>()
		const [index, setIndex] = useState<number>()

		// Modal view-state
		const {
			isOpen: isModalOpen,
			hide: dismissModal,
			show: showModal,
		} = useTransformModalState(setStep, setIndex)

		// Interaction Handlers
		const onSave = useOnSaveStep(graph)
		const {
			onClick: onDelete,
			onConfirm: onConfirmDelete,
			toggle: toggleDeleteModal,
			isOpen: isDeleteModalOpen,
		} = useDeleteConfirm(useOnDeleteStep(graph))
		const onEdit = useOnEditStep(setStep, setIndex, showModal)
		const onCreate = useOnCreateStep(index, dismissModal, onSave, onSelect)
		const onDuplicate = useOnDuplicateStep(graph, table, onSave)
		const { addStepButtonId, editorTarget } = useEditorTarget(index)

		// parallel array of output names for the steps
		const outputs = useStepOutputs(graph)
		const steps = useGraphSteps(graph)
		useGraphOutputListener(graph, onUpdateOutput)
		useGraphWorkflowListener(graph, onUpdateWorkflow)

		return (
			<Container>
				<StepList
					onDeleteClicked={onDelete}
					onSelect={onSelect}
					onEditClicked={onEdit}
					steps={steps}
					outputs={outputs}
					onDuplicateClicked={onDuplicate}
					onStartNewStep={showModal}
					buttonId={addStepButtonId}
				/>
				<div>
					{isModalOpen ? (
						<TableTransformModal
							target={editorTarget}
							step={step}
							index={index ?? graph.steps.length}
							onTransformRequested={onCreate}
							graph={graph}
							onDismiss={dismissModal}
							styles={modalStyles}
							{...props}
						/>
					) : null}

					<DialogConfirm
						toggle={toggleDeleteModal}
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
