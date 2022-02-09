/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableStore } from '@data-wrangling-components/core'
import { DefaultButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import React, { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { StepItem, TableTransformModal } from '../../'
import { DialogConfirm } from '../../DialogConfirm'

export const StepsList: React.FC<{
	steps?: Step[]
	store: TableStore
	onSave?: (step: Step, index?: number) => void
	onDelete?: (index?: number) => void
	onSelect?: (name: string) => void
}> = memo(function StepsList({ steps, store, onSave, onDelete, onSelect }) {
	const [isOpen, { toggle: toggleModal }] = useBoolean(false)
	const [isDuplicating, { toggle: toggleDuplicating }] = useBoolean(false)
	const [isDeleteConfirmOpen, { toggle: toggleDeleteConfirmOpen }] =
		useBoolean(false)
	const [editStep, setEditStep] = useState<Step>()
	const [stepIndex, setStepIndex] = useState<number>()

	const onEdit = useCallback(
		(step: Step, index: number) => {
			setEditStep(step)
			setStepIndex(index)
			toggleModal()
		},
		[setEditStep, toggleModal, setStepIndex],
	)

	const onDuplicate = useCallback(
		(step: Step) => {
			toggleDuplicating()
			const dupStep = {
				...step,
				output: `${step.output}-dup`,
			}
			setEditStep(dupStep)
			toggleModal()
		},
		[setEditStep, toggleModal, toggleDuplicating],
	)

	const onDeleteClicked = useCallback(
		(index: number) => {
			setStepIndex(index)
			toggleDeleteConfirmOpen()
		},
		[toggleDeleteConfirmOpen, setStepIndex],
	)
	const onConfirmDelete = useCallback(() => {
		onDelete && onDelete(stepIndex)
		toggleDeleteConfirmOpen()
	}, [toggleDeleteConfirmOpen, stepIndex, onDelete])

	const onToggleModal = useCallback(() => {
		if (isOpen) {
			setEditStep(undefined)
			setStepIndex(undefined)
		}
		toggleModal()
	}, [isOpen, toggleModal, setStepIndex, setEditStep])

	const onCreate = useCallback(
		(step: Step, index?: number) => {
			onSave && onSave(step, index)
			onToggleModal()
		},
		[onToggleModal, onSave],
	)

	return (
		<Container>
			{onDelete && (
				<DialogConfirm
					toggle={toggleDeleteConfirmOpen}
					title="Are you sure you want to delete this step?"
					subText="You will lose all the table transformations made after this step."
					show={isDeleteConfirmOpen}
					onConfirm={onConfirmDelete}
				/>
			)}

			{steps &&
				steps.map((step, index) => {
					return (
						<StepItem
							onEdit={onEdit && (() => onEdit(step, index))}
							onDelete={onDelete && (() => onDeleteClicked(index))}
							onDuplicate={onDuplicate && (() => onDuplicate(step))}
							onSelect={onSelect && (() => onSelect(step.output))}
							key={index}
							step={step}
						/>
					)
				})}

			{onSave && (
				<>
					<ButtonContainer>
						<DefaultButton iconProps={iconProps.add} onClick={onToggleModal}>
							Add step
						</DefaultButton>
					</ButtonContainer>
					<TableTransformModal
						editStep={editStep}
						isDuplicating={isDuplicating}
						onCreate={onCreate}
						isOpen={isOpen}
						store={store}
						stepIndex={stepIndex}
						toggleModal={onToggleModal}
					/>
				</>
			)}
		</Container>
	)
})

const iconProps = {
	add: { iconName: 'Add' },
}

const Container = styled.div`
	display: flex;
`

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`
