/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Step, Workflow } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { DialogConfirm } from '@essex/themed-components'
import { memo, useCallback, useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'

import { useGraphManager } from '../hooks/common.js'
import type { TransformModalProps } from '../index.js'
import {
	useDeleteConfirm,
	useEditorTarget,
	useOnDeleteStep,
	useOnDuplicateStep,
	useOnEditStep,
	useOnSaveStep,
	useTransformModalState,
} from './ManageWorkflow.hooks.js'
import { StepsList } from './StepsList.js'
import { TableTransformModal } from './TableTransformModal.jsx'

interface ManageWorkflowProps extends Omit<TransformModalProps, 'graph'> {
	/**
	 * The workflow specification
	 */
	workflow?: Workflow

	inputs: TableContainer[]

	/**
	 * Table selection handler
	 */
	onSelect?: (name: string) => void

	/**
	 * Event handler for when the output tableset changes
	 */
	onUpdateOutput: (output: TableContainer[]) => void
}

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
			[graph.steps],
		)

		useEffect(() => {
			return graph.onChange(() => {
				onUpdateOutput(graph.toList().filter(t => !!t) as TableContainer[])
			})
		}, [graph, onUpdateOutput])

		return (
			<Container>
				<StepsList
					onDeleteClicked={onDeleteClicked}
					onSelect={onSelect}
					onEditClicked={onEditClicked}
					steps={graph.steps}
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
