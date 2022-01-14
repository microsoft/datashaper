/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, factory } from '@data-wrangling-components/core'
import { Dropdown, IconButton, Modal, PrimaryButton } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
	selectStepComponent,
	withInputColumnDropdown,
	withOutputColumnTextfield,
} from '../'

export interface ColumnTransformModalProps {
	table: ColumnTable
	isModalOpen: boolean
	onDismiss: () => void
	onTransformRequested: (step: Step) => void
}

/**
 * This presents a model for creating new columns on a table.
 * It is intended to be invoked from a table or column header.
 */
export const ColumnTransformModal: React.FC<ColumnTransformModalProps> = memo(
	function ColumnTransformModal({
		table,
		isModalOpen,
		onDismiss,
		onTransformRequested,
	}) {
		// TODO: allow an existing step to be supplied
		// ideally this is just a step change event
		const [step, setStep] = useState<Step>()
		const handleVerbChange = useCallback(
			(ev: any, opt: any) => {
				// TODO: the assumption here is that the consumer will use runPipeline
				// should we be forcing the i/o table name?
				const newStep = factory(StepType.Verb, opt.key, 'input', 'input')
				setStep(newStep)
			},
			[setStep],
		)
		const Component = useMemo(
			() => (step ? selectStepComponent(step) : null),
			[step],
		)
		const WithColumns = useMemo(
			() =>
				// TODO: i/o columns optional - if this is embedded in column headers as an inline transform
				// they will be pre-supplied
				Component
					? withOutputColumnTextfield()(withInputColumnDropdown()(Component))
					: null,
			[Component],
		)
		const handleRunClick = useCallback(async () => {
			if (table && step) {
				onDismiss()
				onTransformRequested(step)
			}
		}, [table, step, onDismiss, onTransformRequested])
		// TODO: passthrough Modal props?
		return (
			<Modal isOpen={isModalOpen} onDismiss={onDismiss} isBlocking={false}>
				<Header>
					<Title>Derive new column</Title>
					<IconButton
						iconProps={{
							iconName: 'Cancel',
						}}
						ariaLabel="Close popup modal"
						onClick={onDismiss}
					/>
				</Header>
				<Container>
					<Dropdown
						placeholder={'Select transform'}
						options={[
							{
								key: 'bin',
								text: 'Bin',
							},
							{
								key: 'recode',
								text: 'Recode',
							},
						]}
						onChange={handleVerbChange}
					/>
					{WithColumns && step ? (
						<>
							<WithColumns step={step} table={table} onChange={setStep} />
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
	justifycontent: space-between;
	alignitems: center;
	background: ${({ theme }) => theme.application().faint().hex()};
`

const Title = styled.h3`
	padding-left: 12px;
`

const Container = styled.div`
	padding: 12px;
`
