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
import { DefaultButton, IconButton, Modal } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import React, { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { StepComponent, StepSelector } from '..'

export const StepModal: React.FC<{
	isOpen: boolean
	toggleModal: () => void
	store: TableStore
	onCreate: (step: Step, index?: number) => void
	editStep?: Step
	stepIndex?: number
}> = memo(function StepModal({
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
		debugger
		if (editStep) {
			setStep(editStep)
		} else {
			setStep(undefined)
		}
	}, [editStep, setStep])

	const onSelect = useCallback(
		(verb: Verb) => {
			//get latest table
			const tables = store.list()
			const input = tables.length === 0 ? '' : tables[tables.length - 1]

			// console.log(store.toMap) //get the last step
			const step: Step = factory(verb, input, `output-table`)
			setStep(step)
		},
		[setStep, store],
	)

	return (
		<Container>
			<AddModal
				titleAriaId={titleId}
				isOpen={isOpen}
				onDismiss={toggleModal}
				isBlocking={false}
			>
				<ContainerHeader>
					<span id={titleId}>New step</span>
					<IconButton
						iconProps={iconProps.cancel}
						ariaLabel="Close popup modal"
						onClick={toggleModal}
					/>
				</ContainerHeader>

				<ContainerBody>
					<StepSelector verb={step?.verb} onCreate={onSelect} />
					{step && (
						<StepComponent
							step={step}
							store={store}
							index={stepIndex as number}
							onChange={setStep}
							showPreview={false}
						/>
					)}
					<DefaultButton onClick={() => onCreate(step as Step, stepIndex)}>
						Create
					</DefaultButton>
				</ContainerBody>
			</AddModal>
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
const ContainerHeader = styled.div`
	flex: 1 1 auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 12px 14px 24px;
`

const AddModal = styled(Modal)`
	/* display: flex;
	flex-flow: column nowrap;
	align-items: stretch; */
`
