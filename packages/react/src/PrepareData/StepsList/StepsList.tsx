/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableStore } from '@data-wrangling-components/core'
import { DefaultButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import React, { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { StepActions, StepModal } from '../../'

export const StepsList: React.FC<{
	steps: Step[]
	store: TableStore
	onSave: (step: Step, index?: number) => void
}> = memo(function StepsList({ steps, store, onSave }) {
	const [isOpen, { toggle: toggleModal }] = useBoolean(true)
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

	const onToggleModal = useCallback(() => {
		if (isOpen) {
			setEditStep(undefined)
			setStepIndex(undefined)
		}
		toggleModal()
	}, [isOpen, toggleModal, setStepIndex, setEditStep])

	const onCreate = useCallback(
		(step: Step, index?: number) => {
			onSave(step, index)
			onToggleModal()
		},
		[setEditStep, toggleModal],
	)

	return (
		<Container>
			{steps.map((step, index) => {
				return (
					<StepActions
						onEdit={() => onEdit(step, index)}
						key={index}
						step={step}
					/>
				)
			})}
			<ButtonContainer>
				<DefaultButton iconProps={iconProps.add} onClick={onToggleModal}>
					Add step
				</DefaultButton>
			</ButtonContainer>
			<StepModal
				editStep={editStep}
				onCreate={onCreate}
				isOpen={isOpen}
				store={store}
				stepIndex={stepIndex}
				toggleModal={onToggleModal}
			/>
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
