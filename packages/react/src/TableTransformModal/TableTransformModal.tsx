/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	factory,
	Step,
	TableStore,
	Verb,
} from '@data-wrangling-components/core'
import { IconButton, Modal, PrimaryButton } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import React, { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { StepComponent, StepSelector } from '..'

export const TableTransformModal: React.FC<{
	isOpen: boolean
	toggleModal: () => void
	store: TableStore
	onCreate: (step: Step, index?: number) => void
	editStep?: Step
	stepIndex?: number
}> = memo(function TableTransformModal({
	isOpen,
	toggleModal,
	store,
	onCreate,
	editStep,
	stepIndex,
}) {
	const titleId = useId('title')
	const [step, setStep] = useState<Step | undefined>()

	useEffect(() => {
		if (editStep) {
			setStep(editStep)
		}
	}, [editStep])

	const onDismissed = useCallback(() => {
		setStep(undefined)
	}, [setStep])

	const onSelect = useCallback(
		(verb: Verb) => {
			//get latest table
			const tables = store.list()
			//pipeline has a last, should we use it?
			const input = tables.length === 0 ? '' : tables[tables.length - 1]
			// console.log(store.toMap) //get the last step
			const step: Step = factory(verb, input, `output-table`)
			setStep(step)
		},
		[setStep, store],
	)

	return (
		<Container>
			<Modal
				onDismissed={onDismissed}
				titleAriaId={titleId}
				isOpen={isOpen}
				onDismiss={toggleModal}
				isBlocking={false}
			>
				<Header>
					<Title>{editStep ? 'Edit step' : 'New step'}</Title>
					<IconButton
						iconProps={iconProps.cancel}
						ariaLabel="Close popup modal"
						onClick={toggleModal}
					/>
				</Header>

				<ContainerBody>
					<StepSelectorContainer>
						<StepSelector
							placeholder="Select the verb"
							verb={step?.verb || ''}
							onCreate={onSelect}
						/>
					</StepSelectorContainer>
					{step && (
						<>
							<StepComponent
								step={step}
								store={store}
								index={stepIndex as number}
								onChange={setStep}
								showPreview={false}
							/>
							<PrimaryButton onClick={() => onCreate(step as Step, stepIndex)}>
								Run
							</PrimaryButton>
						</>
					)}
				</ContainerBody>
			</Modal>
		</Container>
	)
})

const iconProps = {
	cancel: { iconName: 'Cancel' },
}

const Container = styled.div``
const ContainerBody = styled.div`
	padding: 0px 12px 14px 24px;
`

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: ${({ theme }) => theme.application().faint().hex()};
	margin-bottom: 8px;
`

const Title = styled.h3`
	padding-left: 12px;
	margin: 8px 0 8px 0;
`

const StepSelectorContainer = styled.div`
	margin-bottom: 8px;
`
