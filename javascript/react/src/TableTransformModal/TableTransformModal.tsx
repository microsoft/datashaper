/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '@data-wrangling-components/core'
import { IconButton, Modal, PrimaryButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { StepSelector, TableTransformModalProps } from '../index.js'
import {
	useHandleTableRunClick,
	useHandleTableStepArgs,
	useInternalTableStep,
	useModalStyles,
} from './hooks/index.js'

export const TableTransformModal: React.FC<TableTransformModalProps> = memo(
	function TableTransformModal(props) {
		const {
			onDismiss,
			store,
			onTransformRequested,
			step,
			nextInputTable,
			styles,
			...rest
		} = props

		const { internal, setInternal, handleVerbChange } = useInternalTableStep(
			step,
			nextInputTable,
			store as TableStore,
		)

		const StepArgs = useHandleTableStepArgs(internal, !!step)

		const handleRunClick = useHandleTableRunClick(
			internal,
			onTransformRequested,
		)

		const adaptedStyles = useModalStyles(styles)
		return (
			<Modal
				onDismiss={onDismiss}
				onDismissed={() => setInternal(undefined)}
				styles={adaptedStyles}
				{...rest}
			>
				<Header>
					<Title>{step ? 'Edit step' : 'New step'}</Title>

					{onDismiss && (
						<IconButton
							iconProps={iconProps.cancel}
							ariaLabel="Close popup modal"
							onClick={() => onDismiss()}
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
							<ButtonContainer>
								<PrimaryButton onClick={handleRunClick}>Save</PrimaryButton>
							</ButtonContainer>
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

const ButtonContainer = styled.div`
	margin-top: 8px;
`
