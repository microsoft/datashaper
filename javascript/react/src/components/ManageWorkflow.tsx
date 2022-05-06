/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Step } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { DialogConfirm } from '@essex/themed-components'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useGraphManager } from '../hooks/common.js'
import {
	useDeleteConfirm,
	useEditorTarget,
	useOnDeleteStep,
	useOnDuplicateStep,
	useOnEditStep,
	useOnSaveStep,
	useTransformModalState,
} from './ManageWorkflow.hooks.js'
import { Container, modalStyles } from './ManageWorkflow.styles.js'
import type { ManageWorkflowProps } from './ManageWorkflow.types.js'
import { StepList } from './StepList.js'
import { TableTransformModal } from './TableTransformModal.jsx'

export const ManageWorkflow: React.FC<ManageWorkflowProps> = memo(
	function ManageWorkflow({
		workflow,
		inputs,
		table,
		onSelect,
		onUpdateOutput,
		...props
	}) {
		const graph = useGraphManager(inputs)
		const [graphSteps, setGraphSteps] = useState<Step[]>(graph.steps)

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
		const onCreate = useCallback(
			(step: Step, output: string | undefined) => {
				onSave(step, output, selectedStepIndex)
				onDismissTransformModal()
			},
			[onSave, onDismissTransformModal, selectedStepIndex],
		)
		const onDuplicateClicked = useOnDuplicateStep(graph, table, onSave)
		const { addStepButtonId, editorTarget } = useEditorTarget(selectedStepIndex)

		// create a parallel array of output names for the steps
		const outputs = useMemo(
			() =>
				graph.steps
					.map(s => s.id)
					.map(id => {
						const output = graph.outputDefinitions.find(def => def.node === id)
						return output?.name
					}),
			[graph.steps, graph.outputDefinitions],
		)

		useEffect(
			function emitCurrentTableList() {
				return graph.onChange(() => {
					setGraphSteps(graph.steps)
					onUpdateOutput?.(graph.toList().filter(t => !!t) as TableContainer[])
				})
			},
			[graph, onUpdateOutput],
		)

		console.log('Manage Workflow Render', graph)

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
					{isTransformModalOpen && (
						<TableTransformModal
							target={editorTarget}
							step={selectedStep}
							onTransformRequested={onCreate}
							graph={graph}
							onDismiss={onDismissTransformModal}
							styles={modalStyles}
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
