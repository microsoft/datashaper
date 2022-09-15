/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Verb } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import { readStep } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { TableTransformModal } from '../components/TableTransformModal.js'
import { useTransformModalState } from '../hooks/manageWorkflow.js'
import { useTableCommands } from './TableCommands.hooks.js'
import type { TableCommandsProps } from './TableCommands.types.js'

export const TableCommands: React.FC<TableCommandsProps> = memo(
	function TableCommands({ inputTable, workflow, onAddStep, selectedColumn }) {
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

		const onCallStep = useCallback(
			(
				_?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
				item?: IContextualMenuItem,
			) => {
				const verb = item?.key as Verb
				const target = item?.data?.submenu ? 'groupedMenu' : verb
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

		const commands = useTableCommands(onCallStep, !selectedColumn)

		return (
			<Container>
				<VerbsContainer>{commands}</VerbsContainer>

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
