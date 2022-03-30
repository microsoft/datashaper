/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { DialogConfirm } from '@essex/themed-components'
import React, { memo } from 'react'
import styled from 'styled-components'

import type {
	ColumnTransformModalProps,
	TableTransformModalProps,
} from '../../index.js'
import {
	ColumnTransformModal,
	TableTransformModal,
	useDeleteConfirm,
} from '../../index.js'
import { StepsType } from '../../types.js'
import { StepsList } from '../index.js'
import { useManageSteps } from './hooks/index.js'

interface ManageStepsProps
	extends TableTransformModalProps,
		ColumnTransformModalProps {
	onSave: (step: Step, index?: number | undefined) => void
	onDelete?: ((args: any) => void) | undefined
	type?: StepsType
	onSelect?: (name: string) => void
	steps?: Step[]
}

export const ManageSteps: React.FC<ManageStepsProps> = memo(
	function ManageSteps({
		onDelete,
		onSave,
		onSelect,
		store,
		steps,
		type = StepsType.Table,
		table,
		...props
	}) {
		const {
			onDeleteClicked,
			toggleDeleteModalOpen,
			isDeleteModalOpen,
			onConfirmDelete,
		} = useDeleteConfirm(onDelete)

		const {
			step,
			onDuplicateClicked,
			onEditClicked,
			onCreate,
			onDismissTransformModal,
			onStartNewStep,
			isTransformModalOpen,
			addStepButtonId,
			editorTarget,
		} = useManageSteps(type, store, table, onSave)

		return (
			<Container>
				<StepsList
					onDeleteClicked={onDeleteClicked}
					onSelect={onSelect}
					onEditClicked={onEditClicked}
					steps={steps}
					onDuplicateClicked={onDuplicateClicked}
					onStartNewStep={onStartNewStep}
					buttonId={addStepButtonId}
				/>

				<div>
					{type === StepsType.Table && isTransformModalOpen && (
						<TableTransformModal
							target={editorTarget}
							step={step}
							onTransformRequested={onCreate}
							isOpen={isTransformModalOpen}
							store={store}
							onDismiss={onDismissTransformModal}
							{...props}
						/>
					)}

					{type === StepsType.Column && table && (
						<ColumnTransformModal
							step={step}
							table={table}
							onTransformRequested={onCreate}
							isOpen={isTransformModalOpen}
							onDismiss={onDismissTransformModal}
							{...props}
						/>
					)}

					{onDelete && (
						<DialogConfirm
							toggle={toggleDeleteModalOpen}
							title="Are you sure you want to delete this step?"
							subText={
								type === StepsType.Table
									? 'You will also lose any table transformations made after this step.'
									: ''
							}
							show={isDeleteModalOpen}
							onConfirm={onConfirmDelete}
						/>
					)}
				</div>
			</Container>
		)
	},
)

const Container = styled.div`
	width: 97%;
	display: grid;
`
