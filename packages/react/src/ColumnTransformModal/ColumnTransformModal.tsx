/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Step,
	StepType,
	factory,
	inputColumnSteps,
} from '@data-wrangling-components/core'
import {
	Dropdown,
	IconButton,
	IModalProps,
	Modal,
	PrimaryButton,
} from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { upperFirst } from 'lodash'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
	selectStepComponent,
	withInputColumnDropdown,
	withOutputColumnTextfield,
} from '../'

export interface ColumnTransformModalProps extends IModalProps {
	/**
	 * Table to build the column transform from.
	 */
	table: ColumnTable
	/**
	 * Optional step for controlled component if pre-built config is planned.
	 */
	step?: Step
	/**
	 * Callback fired when the step is configured and "run" is clicked, indicating
	 * the application should execute the contructed/edited step.
	 */
	onTransformRequested?: (step: Step) => void
	/**
	 * Indicates that the input column should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the modal is launched directly from a column, which would make display redundant.
	 */
	hideInputColumn?: boolean
	/**
	 * Indicates that the output column should be hidden or else shown and editable by the user.
	 * It may be desirable to hide this if the transform is expected to do an inline replacement of the input column.
	 */
	hideOutputColumn?: boolean
	/**
	 * Optional list of transform verbs to present to the user.
	 * If not supplied, all verbs that operate on a single input column will be presented.
	 */
	verbs?: string[]
}

/**
 * This presents a model for creating new columns on a table.
 * It is intended to be invoked from a table or column header.
 */
export const ColumnTransformModal: React.FC<ColumnTransformModalProps> = memo(
	function ColumnTransformModal(props) {
		const {
			table,
			step,
			onTransformRequested,
			hideInputColumn,
			hideOutputColumn,
			verbs,
			onDismiss,
			...rest
		} = props

		const [internal, setInternal] = useState<Step | undefined>(step)

		const handleVerbChange = useCallback(
			(ev: any, opt: any) => {
				// TODO: the assumption here is that the consumer will use runPipeline
				// should we be forcing the i/o table name?
				const newStep = factory(StepType.Verb, opt.key, 'input', 'input')
				// merge with the previous step in case input/output columns have been controlled
				setInternal(newStep)
			},
			[setInternal],
		)
		const Component = useMemo(
			() => (internal ? selectStepComponent(internal) : null),
			[internal],
		)
		const WithColumns = useMemo(() => {
			if (Component) {
				let comp = Component
				if (!hideInputColumn) {
					comp = withInputColumnDropdown()(comp)
				}
				if (!hideOutputColumn) {
					comp = withOutputColumnTextfield()(comp)
				}
				return comp
			}
		}, [Component, hideInputColumn, hideOutputColumn])
		const handleRunClick = useCallback(async () => {
			if (table && internal) {
				onDismiss && onDismiss()
				onTransformRequested && onTransformRequested(internal)
			}
		}, [table, internal, onDismiss, onTransformRequested])

		const handleDismissClick = useCallback(
			() => onDismiss && onDismiss(),
			[onDismiss],
		)

		const stepOptions = useMemo(() => {
			const list = verbs || inputColumnSteps()
			return list.map(key => ({
				key,
				text: upperFirst(key),
			}))
		}, [verbs])
		return (
			<Modal onDismiss={onDismiss} {...rest}>
				<Header>
					<Title>Derive new column</Title>
					<IconButton
						iconProps={{
							iconName: 'Cancel',
						}}
						ariaLabel="Close popup modal"
						onClick={handleDismissClick}
					/>
				</Header>
				<Container>
					<Dropdown
						placeholder={'Select transform'}
						options={stepOptions}
						onChange={handleVerbChange}
					/>
					{WithColumns && internal ? (
						<>
							<WithColumns
								step={internal}
								table={table}
								onChange={setInternal}
							/>
							<PrimaryButton onClick={handleRunClick}>Run</PrimaryButton>
						</>
					) : null}
				</Container>
			</Modal>
		)
	},
)

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: ${({ theme }) => theme.application().faint().hex()};
`

const Title = styled.h3`
	padding-left: 12px;
	margin: 8px 0 8px 0;
`

const Container = styled.div`
	padding: 12px;
`
