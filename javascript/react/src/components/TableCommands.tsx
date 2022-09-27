/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Verb } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import { readStep } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { TableTransformModal } from '../components/TableTransformModal.js'
import { useTransformModalState } from '../hooks/manageWorkflow.js'
import {
	useColumnCommands,
	useTableCommands,
	useUndoCommands,
} from './TableCommands.hooks.js'
import type { TableCommandsProps } from './TableCommands.types.js'

export const TableCommands: React.FC<TableCommandsProps> = memo(
	function TableCommands({
		inputTable,
		workflow,
		onAddStep,
		onRemoveStep,
		selectedColumn,
	}) {
		const [step, setStep] = useState<Step | undefined>()
		const [index, setIndex] = useState<number>()
		const [modalTarget, setModalTarget] = useState<string>()

		const {
			isOpen: isModalOpen,
			hide: dismissModal,
			show: showModal,
		} = useTransformModalState(setStep, setIndex)

		const onTransformRequested = useCallback(
			(_step: Step) => {
				onAddStep && onAddStep(_step, _step?.id, index)
				dismissModal()
			},
			[onAddStep, dismissModal, index],
		)
		const onUndoStep = useCallback(() => {
			onRemoveStep && onRemoveStep(workflow.steps.length - 1)
		}, [onRemoveStep, workflow])

		const onCallStep = useCallback(
			(
				_?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
				item?: IContextualMenuItem,
			) => {
				const verb = item?.key as Verb
				const target = item?.data?.id ? item?.data?.id : verb
				const _step = readStep({
					verb,
					args: { to: selectedColumn, column: selectedColumn } as any,
					input: inputTable?.id,
				})
				setStep(_step)
				setModalTarget(target)
				showModal()
			},
			[showModal, setStep, inputTable, selectedColumn, setModalTarget],
		)

		const allTablesLength = useMemo((): number => {
			return workflow.outputNames.length + workflow.inputNames.size
		}, [workflow])

		const columnCommands = useColumnCommands(onCallStep, !selectedColumn)
		const tableCommands = useTableCommands(onCallStep, allTablesLength <= 1)
		const undoCommands = useUndoCommands(onUndoStep, workflow.steps.length < 1)

		return (
			<Container>
				<VerbsContainer>
					{undoCommands}
					{columnCommands}
					{tableCommands}
				</VerbsContainer>

				{isModalOpen ? (
					<TableTransformModal
						hideInput
						hideOutput
						target={`#${modalTarget}`}
						step={step}
						index={index ?? workflow.steps.length}
						onTransformRequested={onTransformRequested}
						workflow={workflow}
						onDismiss={dismissModal}
						showGuidance
					/>
				) : null}
			</Container>
		)
	},
)

const Container = styled.div``
const VerbsContainer = styled.div`
	display: flex;
`
