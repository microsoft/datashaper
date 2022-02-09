/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Verb,
	Step,
	factory,
	columnTransformVerbs,
} from '@data-wrangling-components/core'
import { Dropdown, IconButton, Modal, PrimaryButton } from '@fluentui/react'
import { upperFirst } from 'lodash'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
	selectStepComponent,
	TransformModalProps,
	withInputColumnDropdown,
	withOutputColumnTextfield,
} from '../'

export interface ColumnTransformModalProps extends TransformModalProps {
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
			headerText,
			onDismiss,
			...rest
		} = props

		const [internal, setInternal] = useState<Step | undefined>(step)

		const handleVerbChange = useCallback(
			(ev: any, opt: any) => {
				// TODO: the assumption here is that the consumer will use runPipeline
				// should we be forcing the i/o table name?
				const inputTable = step?.input ?? 'input'
				const outputTable = step?.output ?? 'input'
				const newStep = factory(opt.key, inputTable, outputTable)
				// merge with the previous step in case input/output columns have been controlled
				setInternal(newStep)
			},
			[setInternal, step],
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
			const list =
				verbs ||
				columnTransformVerbs(s => s !== Verb.Aggregate && s !== Verb.Rollup)
			return list.map(key => ({
				key,
				text: upperFirst(key),
			}))
		}, [verbs])
		return (
			<Modal onDismiss={onDismiss} {...rest}>
				<Header>
					<Title>{headerText}</Title>
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
