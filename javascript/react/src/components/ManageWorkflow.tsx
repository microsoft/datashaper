/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Step } from '@datashaper/workflow'
import { DialogConfirm } from '@essex/themed-components'
import { memo, useCallback, useState } from 'react'

import {
	useOnCreateStep,
	useOnDeleteStep,
	useOnDuplicateStep,
	useOnEditStep,
	useOnSaveStep,
	useStepOutputs,
	useTransformModalState,
	useWorkflow,
	useWorkflowListener,
	useWorkflowOutputListener,
	useWorkflowSteps,
} from '../hooks/index.js'
import { useDeleteConfirm, useEditorTarget } from './ManageWorkflow.hooks.js'
import { Container, modalStyles } from './ManageWorkflow.styles.js'
import type { ManageWorkflowProps } from './ManageWorkflow.types.js'
import { StepHistoryList } from './StepHistoryList.js'
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
		nextInputTable,
		historyView = false,
		...props
	}) {
		const wf = useWorkflow(workflow, inputs)

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
		const onSave = useOnSaveStep(wf)
		const {
			onClick: onDelete,
			onConfirm: onConfirmDelete,
			toggle: toggleDeleteModal,
			isOpen: isDeleteModalOpen,
		} = useDeleteConfirm(useOnDeleteStep(wf))
		const onEdit = useOnEditStep(setStep, setIndex, showModal)
		const onCreate = useOnCreateStep(onSave, onSelect, dismissModal)
		const onDuplicate = useOnDuplicateStep(wf, table, onSave)
		const { addStepButtonId, editorTarget } = useEditorTarget(index)

		const onViewStep = useCallback(
			(name: string) => {
				const tableName =
					wf.outputDefinitions.find(x => x.node === name)?.name ?? ''
				onSelect && onSelect(tableName)
			},
			[onSelect, wf],
		)

		const onTransformRequested = useCallback(
			(step: Step, output: string | undefined) => {
				onCreate(step, output, index)
			},
			[index, onCreate],
		)

		// parallel array of output names for the steps
		const outputs = useStepOutputs(wf)
		const steps = useWorkflowSteps(wf)
		useWorkflowOutputListener(wf, onUpdateOutput)
		useWorkflowListener(wf, onUpdateWorkflow)

		return (
			<Container>
				{historyView ? (
					<StepHistoryList
						onDeleteClicked={onDelete}
						onSelect={onViewStep}
						steps={steps}
						onStartNewStep={showModal}
						buttonId={addStepButtonId}
						workflow={wf}
						nextInputTable={nextInputTable}
						onCreate={onCreate}
					/>
				) : (
					<StepList
						onDeleteClicked={onDelete}
						onSelect={onViewStep}
						onEditClicked={onEdit}
						steps={steps}
						outputs={outputs}
						onDuplicateClicked={onDuplicate}
						onStartNewStep={showModal}
						buttonId={addStepButtonId}
					/>
				)}

				<div>
					{isModalOpen ? (
						<TableTransformModal
							target={editorTarget}
							step={step}
							index={index ?? wf.steps.length}
							onTransformRequested={onTransformRequested}
							workflow={wf}
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
