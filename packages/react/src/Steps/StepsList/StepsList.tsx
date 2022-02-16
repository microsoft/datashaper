/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableStore } from '@data-wrangling-components/core'
import { DialogConfirm } from '@essex-js-toolkit/themed-components'
import { IconButton, TooltipHost } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { DetailText } from '../../PrepareData/DetailText/index.js'
import { StepCard, TableTransformModal, useDeleteConfirm } from '../../index.js'
import { useManageSteps } from './hooks'

export const StepsList: React.FC<{
	steps?: Step[]
	store: TableStore
	onSave?: (step: Step, index?: number) => void
	onDelete?: (index: number) => void
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
		step,
		onDuplicateClicked,
		onEditClicked,
		onCreate,
		onDismissClearTableModal,
		showTableModal,
		isTableModalOpen,
	} = useManageSteps(store, onSave)

	const {
		onDeleteClicked,
		toggleDeleteModalOpen,
		isDeleteModalOpen,
		onConfirmDelete,
	} = useDeleteConfirm(onDelete)

	return (
		<Container>
			{steps?.map((_step, index) => {
				return (
					<StepCard
						onEdit={onEditClicked}
						onDelete={onDeleteClicked}
						onDuplicate={onDuplicateClicked}
						onSelect={onSelect}
						key={index}
						step={_step}
						index={index}
					/>
				)
			})}

			{onSave && (
				<ButtonContainer>
					{!steps?.length && (
						<DetailText text="Add here the first preparation step" />
					)}
					<TooltipHost content="Add step" setAriaDescribedBy={false}>
						<IconButton
							iconProps={iconProps.add}
							onClick={showTableModal}
						></IconButton>
					</TooltipHost>
				</ButtonContainer>
			)}

			<TableTransformModal
				step={step}
				nextInputTable={nextInputTable}
				onTransformRequested={onCreate}
				isOpen={isTableModalOpen}
				store={store}
				onDismiss={onDismissClearTableModal}
			/>
			{onDelete && (
				<DialogConfirm
					toggle={toggleDeleteModalOpen}
					title="Are you sure you want to delete this step?"
					subText="You will lose all the table transformations made after this step."
					show={isDeleteModalOpen}
					onConfirm={onConfirmDelete}
				/>
			)}
		</Container>
	)
})

const iconProps = {
	add: { iconName: 'Add' },
}

const Container = styled.div`
	display: flex;
	overflow: auto;
	column-gap: 8px;
`

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	white-space: pre;
	align-items: center;
`
