/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableStore } from '@data-wrangling-components/core'
import { DefaultButton } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { StepItem, TableTransformModal } from '../../'
import { DialogConfirm } from '../../DialogConfirm'
import { useDeleteStep, useManageModal, useManageSteps } from './hooks'

export const StepsList: React.FC<{
	steps?: Step[]
	store: TableStore
	onSave?: (step: Step, index?: number) => void
	onDelete?: (index?: number) => void
	onSelect?: (name: string) => void
	nextInputTable: string
}> = memo(function StepsList({
	steps,
	store,
	onSave,
	onDelete,
	onSelect,
	nextInputTable,
}) {
	const {
		hideTableModal,
		isTableModalOpen,
		showTableModal,
		isDuplicatingStep,
		toggleDuplicatingStep,
	} = useManageModal()

	const {
		step,
		onDuplicate,
		onEdit,
		onCreate,
		modalHeaderText,
		onDismissClearTableModal,
	} = useManageSteps(
		showTableModal,
		toggleDuplicatingStep,
		isDuplicatingStep,
		hideTableModal,
		onSave,
	)

	const {
		onDeleteClicked,
		toggleDeleteModalOpen,
		isDeleteModalOpen,
		onConfirmDelete,
	} = useDeleteStep(onDelete)

	return (
		<Container>
			{onDelete && (
				<DialogConfirm
					toggle={toggleDeleteModalOpen}
					title="Are you sure you want to delete this step?"
					subText="You will lose all the table transformations made after this step."
					show={isDeleteModalOpen}
					onConfirm={onConfirmDelete}
				/>
			)}

			{steps &&
				steps.map((_step, index) => {
					return (
						<StepItem
							onEdit={onEdit}
							onDelete={onDeleteClicked}
							onDuplicate={onDuplicate}
							onSelect={onSelect}
							key={index}
							step={_step}
							index={index}
						/>
					)
				})}

			{onSave && (
				<ButtonContainer>
					<DefaultButton iconProps={iconProps.add} onClick={showTableModal}>
						Add step
					</DefaultButton>
				</ButtonContainer>
			)}

			<TableTransformModal
				step={step}
				headerText={modalHeaderText}
				nextInputTable={nextInputTable}
				stepsLength={steps?.length}
				onTransformRequested={onCreate}
				isOpen={isTableModalOpen}
				store={store}
				onDismiss={onDismissClearTableModal}
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
	white-space: pre;
`
