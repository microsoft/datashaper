/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Verb } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import {
	readStep,
	isInputColumnStep,
	isOutputColumnStep,
} from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import { useObservable, useObservableState } from 'observable-hooks'
import { memo, useCallback, useState } from 'react'
import { map } from 'rxjs'
import styled from 'styled-components'

import { useSuggestedTableName } from '../../hooks/tables/useSuggestedTableName.js'
import { StepEditorModal } from './StepEditorModal.js'
import {
	useColumnCommands,
	useTableCommands,
	useTransformModalState,
	useUndoCommands,
} from './TableCommands.hooks.js'
import type { TableCommandsProps } from './TableCommands.types.js'
import { useNewStepInputName } from '../../hooks/workflow/index.js'

export const TableCommands: React.FC<TableCommandsProps> = memo(
	function TableCommands({
		workflow,
		onAddStep,
		metadata,
		onRemoveStep,
		selectedColumn,
		color,
		background,
		commandBarProps,
	}) {
		const [step, setStep] = useState<Step | undefined>()
		const [index, setIndex] = useState<number>()
		const [modalTarget, setModalTarget] = useState<string>()
		const createTableId = useSuggestedTableName(workflow)
		const {
			isOpen: isModalOpen,
			hide: dismissModal,
			show: showModal,
		} = useTransformModalState(setStep, setIndex)

		const onSave = useCallback(
			(_step: Step) => {
				onAddStep?.(_step, _step?.id, index)
				dismissModal()
			},
			[onAddStep, dismissModal, index],
		)
		const onUndoStep = useCallback(() => {
			onRemoveStep?.(workflow.length - 1)
		}, [onRemoveStep, workflow])

		const input = useNewStepInputName(workflow)

		const onCallStep = useCallback(
			(
				_?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
				item?: IContextualMenuItem,
			) => {
				const verb = item?.key as Verb
				const id = createTableId(verb)
				const args = {} as any
				const _step = readStep({
					id,
					verb,
					args,
					input,
				})
				// if the verb has an input column, use the selected column
				if (isInputColumnStep(verb)) {
					_step.args.column = selectedColumn
				}
				// if the verb has an output column, default it to the selected column as a direct replacement
				if (isOutputColumnStep(verb)) {
					_step.args.to = selectedColumn
				}
				setStep(_step)
				const target = item?.data?.id ? item?.data?.id : verb
				setModalTarget(target)
				showModal()
			},
			[
				showModal,
				setStep,
				selectedColumn,
				createTableId,
				setModalTarget,
				input,
			],
		)

		const allTablesLengthObservable = useObservable(
			() => workflow.tableNames$.pipe(map((tables) => tables.length)),
			[workflow],
		)
		const allTablesLength = useObservableState(allTablesLengthObservable, 0)

		const columnCommands = useColumnCommands(
			onCallStep,
			!selectedColumn,
			color,
			background,
			commandBarProps,
			selectedColumn,
			metadata,
		)
		const tableCommands = useTableCommands(
			onCallStep,
			allTablesLength <= 1,
			color,
			background,
			commandBarProps,
		)
		const undoCommands = useUndoCommands(
			onUndoStep,
			workflow.length < 1,
			color,
			background,
			commandBarProps,
		)

		return (
			<Container>
				<VerbsContainer>
					<CommandBar {...undoCommands} />
					<CommandBar {...columnCommands} />
					<CommandBar {...tableCommands} />
				</VerbsContainer>

				{isModalOpen ? (
					<StepEditorModal
						target={`#${modalTarget}`}
						step={step}
						index={index ?? workflow.length}
						onSave={onSave}
						workflow={workflow}
						metadata={metadata}
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
