/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import type { Verb } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import { readStep } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { memo, useCallback, useMemo, useState } from 'react'
import { map } from 'rxjs'
import styled from 'styled-components'

import { useTransformModalState } from '../../hooks/useTransformModalState.js'
import { useSuggestedTableName } from '../../hooks/workflow/useSuggestedTableName.js'
import {
	useColumnCommands,
	useTableCommands,
	useUndoCommands,
} from './TableCommands.hooks.js'
import type { TableCommandsProps } from './TableCommands.types.js'
import { TableTransformModal } from './TableTransformModal.js'

export const TableCommands: React.FC<TableCommandsProps> = memo(
	function TableCommands({
		inputTable,
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

		const onTransformRequested = useCallback(
			(_step: Step) => {
				onAddStep?.(_step, _step?.id, index)
				dismissModal()
			},
			[onAddStep, dismissModal, index],
		)
		const onUndoStep = useCallback(() => {
			onRemoveStep?.(workflow.length - 1)
		}, [onRemoveStep, workflow])

		const onCallStep = useCallback(
			(
				_?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
				item?: IContextualMenuItem,
			) => {
				const verb = item?.key as Verb
				const target = item?.data?.id ? item?.data?.id : verb
				const id = createTableId(verb)
				const _step = readStep({
					id,
					verb,
					args: { to: selectedColumn, column: selectedColumn } as any,
					input: inputTable?.id,
				})
				setStep(_step)
				setModalTarget(target)
				showModal()
			},
			[
				showModal,
				setStep,
				inputTable,
				selectedColumn,
				createTableId,
				setModalTarget,
			],
		)

		const allTablesLengthObservable = useMemo(
			() => workflow.allTableNames$.pipe(map(tables => tables.length)),
			[workflow],
		)
		const allTablesLength = useObservableState(allTablesLengthObservable, 0)

		const columnCommands = useColumnCommands(
			onCallStep,
			!selectedColumn,
			color,
			background,
			commandBarProps,
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
					<TableTransformModal
						hideInput
						hideOutput
						target={`#${modalTarget}`}
						step={step}
						index={index ?? workflow.length}
						onTransformRequested={onTransformRequested}
						workflow={workflow}
						metadata={metadata}
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
