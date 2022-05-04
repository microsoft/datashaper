/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@data-wrangling-components/core'
import index from '@data-wrangling-components/verb-guidance'
import {
	Callout,
	DirectionalHint,
	IconButton,
	PrimaryButton,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'
import styled from 'styled-components'

import { Guidance } from '../Guidance/index.js'
import type { TableTransformModalProps } from '../index.js'
import { StepSelector } from '../index.js'
import {
	useHandleTableRunClick,
	useHandleTableStepArgs,
	useInternalTableStep,
	useModalStyles,
} from './TableTransformModal.hooks.js'

export const TableTransformModal: React.FC<TableTransformModalProps> = memo(
	function TableTransformModal({
		onDismiss,
		graph,
		onTransformRequested,
		step,
		nextInputTable,
		styles,
		...props
	}) {
		const [isGuidanceVisible, { toggle: toggleIsGuidanceVisible }] =
			useBoolean(false)
		const { internal, setInternal, handleVerbChange } = useInternalTableStep(
			step,
			nextInputTable,
			graph as GraphManager,
		)

		const StepArgs = useHandleTableStepArgs(internal, !!step)

		const handleRunClick = useHandleTableRunClick(
			internal,
			onTransformRequested,
		)
		console.log('STEP', internal, step)

		const adaptedStyles = useModalStyles(styles, isGuidanceVisible)
		return (
			<Callout
				onDismissed={() => setInternal(undefined)}
				styles={adaptedStyles}
				directionalHint={DirectionalHint.rightBottomEdge}
				{...props}
			>
				<Header>
					<Title>{step ? 'Edit step' : 'New step'}</Title>
					{onDismiss && (
						<IconButton
							iconProps={icons.cancel}
							ariaLabel="Close popup modal"
							onClick={() => onDismiss()}
						/>
					)}
				</Header>

				<ContainerBody showGuidance={isGuidanceVisible}>
					<StepComponentContainer>
						<StepSelectorContainer>
							<StepSelector
								placeholder="Select a verb"
								verb={internal?.verb}
								onCreate={handleVerbChange}
							/>
							{internal?.verb ? (
								<IconButton
									onClick={toggleIsGuidanceVisible}
									iconProps={icons.info}
									checked={isGuidanceVisible}
								/>
							) : null}
						</StepSelectorContainer>
						{internal && StepArgs && (
							<>
								<StepArgs
									step={internal}
									graph={graph}
									onChange={setInternal}
								/>
								<ButtonContainer>
									<PrimaryButton onClick={handleRunClick}>Save</PrimaryButton>
								</ButtonContainer>
							</>
						)}
					</StepComponentContainer>
					{isGuidanceVisible && internal?.verb ? (
						<GuidanceContainer>
							<Guidance name={internal?.verb} index={index} />
						</GuidanceContainer>
					) : null}
				</ContainerBody>
			</Callout>
		)
	},
)

const icons = {
	cancel: { iconName: 'Cancel' },
	info: { iconName: 'Info' },
}

const MAX_HEIGHT = 700

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

const StepComponentContainer = styled.div`
	width: 316px;
	max-height: ${MAX_HEIGHT}px;
	overflow: hidden auto;
`

const StepSelectorContainer = styled.div`
	margin-bottom: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const ButtonContainer = styled.div`
	margin-top: 8px;
`

const GuidanceContainer = styled.div`
	width: 400px;
	max-height: ${MAX_HEIGHT - 20}px;
	overflow: hidden auto;
`
