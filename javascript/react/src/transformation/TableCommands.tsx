/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { BinArgs} from '@datashaper/schema';
import { BinStrategy, Verb } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'
import { IconButton } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useTransformModalState } from '../components/ManageWorkflow.hooks.js'
import { TableTransformModal } from '../components/TableTransformModal.js'
import { getVerbIcon } from '../verbIcons.js'

export const TableCommands: React.FC<{
	inputTable: TableContainer | undefined
	wf: Workflow
	onAddStep?: (
		step: Step,
		output: string | undefined,
		index: number | undefined,
	) => void
}> = memo(function TableCommands({ inputTable, wf, onAddStep }) {
	const [step, setStep] = useState<Step | undefined>()
	const [index, setIndex] = useState<number>()
	// Modal view-state
	const {
		isOpen: isModalOpen,
		hide: dismissModal,
		show: showModal,
	} = useTransformModalState(setStep, setIndex)

	const onAAA = useCallback(() => {
		const outputName = wf.suggestOutputName(Verb.Bin)
		const aaa = {
			verb: Verb.Bin,
			input: { source: { node: inputTable?.id } },
			id: outputName,
			args: {
				to: 'abc123',
				strategy: BinStrategy.Auto,
				column: 'population_type',
			},
		} as Step<BinArgs>
		setStep(aaa)
		console.log('aaa', aaa)
		showModal()
	}, [showModal, setStep, inputTable, wf])

	return (
		<Container>
			{/* //configuravel */}
			<IconButton
				title={''}
				id="abc123"
				checked={false}
				iconProps={{ iconName: getVerbIcon(Verb.Bin) }}
				onClick={onAAA}
			/>
			{isModalOpen ? (
				<TableTransformModal
					hideInput
					hideOutput
					target="#abc123"
					step={step}
					index={index ?? wf.steps.length}
					onTransformRequested={_step => {
						onAddStep && onAddStep(_step, _step?.id, index)
						dismissModal()
					}}
					workflow={wf}
					onDismiss={dismissModal}
					// styles={modalStyles}
					// {...props}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div``
