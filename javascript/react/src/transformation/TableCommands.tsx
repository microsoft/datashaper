/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import { Verb } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'
import { readStep } from '@datashaper/workflow'
import { ActionButton, Icon } from '@fluentui/react'
import type { Theme } from '@thematic/core'
import upperFirst from 'lodash-es/upperFirst.js'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { TableTransformModal } from '../components/TableTransformModal.js'
import { useTransformModalState } from '../hooks/manageWorkflow.js'
import { getVerbIcon } from '../verbIcons.js'

const defaultVerbs = [Verb.Bin, Verb.Binarize, Verb.Filter, Verb.Aggregate]
export const TableCommands: React.FC<{
	inputTable: TableContainer | undefined
	workflow: Workflow
	onAddStep?: (
		step: Step,
		output: string | undefined,
		index: number | undefined,
	) => void
}> = memo(function TableCommands({ inputTable, workflow, onAddStep }) {
	const [step, setStep] = useState<Step | undefined>()
	const [index, setIndex] = useState<number>()
	// Modal view-state
	const {
		isOpen: isModalOpen,
		hide: dismissModal,
		show: showModal,
	} = useTransformModalState(setStep, setIndex)

	const onCallStep = useCallback(
		(verb: Verb) => {
			const outputName = workflow.suggestOutputName(verb)
			const _step = readStep({ verb, id: outputName, input: inputTable?.id })
			setStep(_step)
			showModal()
		},
		[showModal, setStep, inputTable, workflow],
	)

	return (
		<Container>
			<VerbsContainer>
				{defaultVerbs.map(verb => (
					<VerbButton key={verb} onClick={() => onCallStep(verb)}>
						<Icon
							title={''}
							id={verb}
							style={{ color: 'inherit' }}
							iconName={getVerbIcon(verb)}
						/>
						<VerbName>{upperFirst(verb)}</VerbName>
					</VerbButton>
				))}
			</VerbsContainer>

			{isModalOpen ? (
				<TableTransformModal
					hideInput
					hideOutput
					target={`#${step?.verb}`}
					step={step}
					index={index ?? workflow.steps.length}
					onTransformRequested={_step => {
						onAddStep && onAddStep(_step, _step?.id, index)
						dismissModal()
					}}
					workflow={workflow}
					onDismiss={dismissModal}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div``
const VerbsContainer = styled.div`
	display: flex;
`
const VerbButton = styled(ActionButton)`
	color: inherit;
	display: flex;
	&:hover {
		color: ${({ theme }: { theme: Theme }) =>
			theme.application().border().hex()};
	}
`
const VerbName = styled.span`
	margin-left: 5px;
`
