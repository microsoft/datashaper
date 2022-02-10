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
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
	selectStepComponent,
	StepSelector,
	TransformModalProps,
	withInputColumnDropdown,
	withOutputColumnTextfield,
	withOutputTableTextfield,
	withTableDropdown,
} from '..'

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
	stepIndex?: number
	store: TableStore
}

export const TableTransformModal: React.FC<TableTransformModalProps> = memo(
	function TableTransformModal(props) {
		const {
			onDismiss,
			store,
			onTransformRequested,
			step,
			stepIndex,
			headerText,
			...rest
		} = props
		const [internal, setInternal] = useState<Step | undefined>(step)

		useEffect(() => {
			if (step) {
				setInternal(step)
			}
		}, [step])

		const onDismissed = useCallback(() => {
			setInternal(undefined)
		}, [setInternal])

		const handleVerbChange = useCallback(
			(verb: Verb) => {
				const tables = store.list()
				const length = tables.length
				//pipeline has a last, should we use it?
				const input = length === 0 ? '' : tables[length - 1]

				//GET STEPS NOT STORE
				const step: Step = factory(verb, input, `output-${length + 1}-${verb}`)
				setInternal(step)
			},
			[setInternal, store],
		)

		const handleDismissClick = useCallback(
			() => onDismiss && onDismiss(),
			[onDismiss],
		)

		const handleRunClick = useCallback(async () => {
			if (internal) {
				onDismiss && onDismiss()
				onTransformRequested && onTransformRequested(internal, stepIndex)
			}
		}, [onDismiss, onTransformRequested, internal, stepIndex])

		const Component = useMemo(
			() => (internal ? selectStepComponent(internal) : null),
			[internal],
		)

		const WithAllArgs = useMemo(() => {
			if (Component) {
				withTableDropdown()(
					withOutputColumnTextfield()(
						withInputColumnDropdown()(withOutputTableTextfield()(Component)),
					),
				)
			}
		}, [Component])

		return (
			<Modal
				onDismissed={onDismissed}
				onDismiss={onDismiss}
				isBlocking={false}
				{...rest}
			>
				<Header>
					<Title>{headerText}</Title>

					{onDismiss && (
						<IconButton
							iconProps={iconProps.cancel}
							ariaLabel="Close popup modal"
							onClick={handleDismissClick}
						/>
					)}
				</Header>

				<ContainerBody>
					<StepSelectorContainer>
						<StepSelector
							placeholder="Select the verb"
							verb={internal?.verb || ''}
							onCreate={handleVerbChange}
						/>
					</StepSelectorContainer>
					{internal && WithAllArgs && (
						<>
							{WithAllArgs}
							<PrimaryButton onClick={handleRunClick}>Run</PrimaryButton>
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
	margin-bottom: 8px;
`

const Title = styled.h3`
	padding-left: 12px;
	margin: 8px 0 8px 0;
`

const StepSelectorContainer = styled.div`
	margin-bottom: 8px;
`
