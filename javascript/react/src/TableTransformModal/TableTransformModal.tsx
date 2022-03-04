/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '@data-wrangling-components/core'
import index from '@data-wrangling-components/guidance'
import { IconButton, Modal, PrimaryButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import React, { memo } from 'react'
import styled from 'styled-components'
import { Guidance } from '../Guidance/index.js'
import { StepSelector, TableTransformModalProps } from '../index.js'
import {
	useHandleTableRunClick,
	useHandleTableStepArgs,
	useInternalTableStep,
	useModalStyles,
} from './TableTransformModal.hooks.js'

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
		const [isGuidanceVisible, { toggle: toggleIsGuidanceVisible }] =
			useBoolean(false)
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

		const adaptedStyles = useModalStyles(styles, isGuidanceVisible)
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

				<ContainerBody showGuidance={isGuidanceVisible}>
					<div>
						<StepSelectorContainer>
							<StepSelector
								placeholder="Select a verb"
								verb={internal?.verb}
								onCreate={handleVerbChange}
							/>
							{internal?.verb ? (
								<IconButton
									onClick={toggleIsGuidanceVisible}
									iconProps={{ iconName: 'Info' }}
									checked={isGuidanceVisible}
								/>
							) : null}
						</StepSelectorContainer>
						{internal && StepArgs && (
							<>
								<StepArgs
									step={internal}
									store={store}
									onChange={setInternal}
								/>
								<ButtonContainer>
									<PrimaryButton onClick={handleRunClick}>Save</PrimaryButton>
								</ButtonContainer>
							</>
						)}
					</div>
					{isGuidanceVisible && internal?.verb ? (
						<Guidance
							name={internal?.verb}
							index={index as Record<string, string>}
						/>
					) : null}
				</ContainerBody>
			</Modal>
		)
	},
)

const iconProps = {
	cancel: { iconName: 'Cancel' },
}

const ContainerBody = styled.div<{ showGuidance: boolean }>`
	padding: 0px 12px 14px 24px;
	display: flex;
	justify-content: flex-start;
	gap: 12px;
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
	display: flex;
	justify-content: flex-start;
	align-items: center;
`

const ButtonContainer = styled.div`
	margin-top: 8px;
`
