/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '@data-wrangling-components/core'
import { IconButton, Modal, PrimaryButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { StepSelector, TransformModalProps } from '../index.js'
import {
	useHandleDismiss,
	useHandleRunClick,
	useHandleStepArgs,
	useInternalStep,
} from './hooks/index.js'

export interface TableTransformModalProps extends TransformModalProps {
	/**
	 * Indicates that the input table should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the modal is launched directly from a table, which would make display redundant.
	 */
	hideInputTable?: boolean
	/**
	 * Indicates that the output table should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the transform is expected to do an inline replacement of the input table.
	 */
	hideOutputTable?: boolean
	store: TableStore
	nextInputTable: string
}

export const TableTransformModal: React.FC<TableTransformModalProps> = memo(
	function TableTransformModal(props) {
		const {
			onDismiss,
			store,
			onTransformRequested,
			step,
			nextInputTable,
			...rest
		} = props

		const { internal, setInternal, handleVerbChange } = useInternalStep(
			step,
			nextInputTable,
			store,
		)

		const handleDismiss = useHandleDismiss(onDismiss, setInternal)
		const StepArgs = useHandleStepArgs(internal, !!step)

		const handleRunClick = useHandleRunClick(
			handleDismiss,
			internal,
			onTransformRequested,
		)

		return (
			<Modal onDismiss={handleDismiss} {...rest}>
				<Header>
					<Title>{step ? 'Edit step' : 'New step'}</Title>

					{onDismiss && (
						<IconButton
							iconProps={iconProps.cancel}
							ariaLabel="Close popup modal"
							onClick={handleDismiss}
						/>
					)}
				</Header>

				<ContainerBody>
					<StepSelectorContainer>
						<StepSelector
							placeholder="Select a verb"
							verb={internal?.verb || ''}
							onCreate={handleVerbChange}
						/>
					</StepSelectorContainer>
					{internal && StepArgs && (
						<>
							<StepArgs step={internal} store={store} onChange={setInternal} />
							<PrimaryButton onClick={handleRunClick}>Save</PrimaryButton>
						</>
					)}
				</ContainerBody>
			</Modal>
		)
	},
)

const iconProps = {
	cancel: { iconName: 'Cancel' },
}

const ContainerBody = styled.div`
	padding: 0px 12px 14px 24px;
`

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: ${({ theme }) => theme.application().faint().hex()};
	margin-bottom: 12px;
`

const Title = styled.h3`
	padding-left: 12px;
	margin: 8px 0 8px 0;
`

const StepSelectorContainer = styled.div`
	margin-bottom: 8px;
`
