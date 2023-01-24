/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'
import { isNoArgsStep } from '@datashaper/workflow'
import { CollapsiblePanel, DialogConfirm } from '@essex/components'
import { memo } from 'react'

import { DisplayOrder } from '../../enums.js'
import { useWorkflowSteps } from '../../hooks/workflow/useWorkflowSteps.js'
import { Action } from '../controls/index.js'
import { StepEditor } from '../StepEditor/index.js'
import { StepHeader } from './StepHeader.js'
import type { StepHeaderStyles } from './StepHeader.types.js'
import { useDeleteConfirm } from './StepList.hooks.js'
import {
	ButtonContainer,
	buttonStyles,
	Container,
	icons,
	StepsContainer,
	useCollapsiblePanelStyles,
} from './StepList.styles.js'
import type { StepListProps } from './StepList.types.js'

export const StepList: React.FC<StepListProps> = memo(function StepStack({
	workflow,
	order = DisplayOrder.FirstOnTop,
	onDelete,
	onSelect,
	onSave,
	onSelectInputTable,
	onSelectLatestTable,
	selectedKey,
	styles,
}) {
	const steps = useWorkflowSteps(workflow, order)

	const collapsiblePanelStyles = useCollapsiblePanelStyles()
	const {
		onClick: onDeleteClicked,
		onConfirm: onConfirmDelete,
		toggle: toggleDeleteModal,
		isOpen: isDeleteModalOpen,
	} = useDeleteConfirm(onDelete)

	return (
		<Container style={styles?.root}>
			<DialogConfirm
				toggle={toggleDeleteModal}
				title="Are you sure you want to delete this step?"
				subText={
					'You will also lose any table transformations made after this step.'
				}
				show={isDeleteModalOpen}
				onConfirm={onConfirmDelete}
			/>
			{(onSelectInputTable || onSelectLatestTable) && (
				<ButtonContainer style={styles?.buttonContainer}>
					<Action
						type="default"
						disabled={!steps.length}
						iconProps={icons.preview}
						style={buttonStyles}
						onClick={onSelectInputTable}
					>
						Original
					</Action>

					<Action
						type="default"
						disabled={!steps.length}
						iconProps={icons.preview}
						style={buttonStyles}
						onClick={onSelectLatestTable}
					>
						Latest
					</Action>
				</ButtonContainer>
			)}
			<StepsContainer style={styles?.stepsContainer}>
				{steps.map((step) => {
					const stepIndex = workflow.steps.findIndex((s) => s.id === step.id)
					const handleSave =
						isNoArgsStep(step) || !onSave
							? undefined
							: (s: Step) => onSave(s, stepIndex)
					const handleDelete =
						onDeleteClicked && (() => onDeleteClicked(stepIndex))
					return (
						<CollapsiblePanel
							key={step.id}
							styles={collapsiblePanelStyles}
							onHeaderClick={() => onSelect?.(step.id)}
							onRenderHeader={() =>
								onRenderHeader(
									step,
									stepIndex,
									selectedKey === step.id,
									styles?.stepHeaders,
								)
							}
						>
							<StepEditor
								step={step}
								index={stepIndex}
								workflow={workflow}
								onDelete={handleDelete}
								onSave={handleSave}
							/>
						</CollapsiblePanel>
					)
				})}
			</StepsContainer>
		</Container>
	)
})

function onRenderHeader(
	step: Step,
	index: number,
	selected = false,
	styles?: StepHeaderStyles,
): JSX.Element {
	return (
		<StepHeader step={step} index={index} selected={selected} styles={styles} />
	)
}
