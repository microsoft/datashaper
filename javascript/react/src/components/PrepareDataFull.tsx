/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import { IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback } from 'react'

import { useWorkflow } from '../hooks/common.js'
import { useWorkflowOutputListener } from '../hooks/manageWorkflow.js'
import { useStepOutputs } from '../hooks/useStepOutputs.js'
import { useWorkflowSteps } from '../hooks/useWorkflowSteps.js'
import { ArqueroDetailsList } from './ArqueroDetailsList/ArqueroDetailsList.js'
import { ArqueroTableHeader } from './ArqueroTableHeader/ArqueroTableHeader.js'
import { DetailText } from './DetailText.js'
import { HistoryButton } from './HistoryButton.js'
import { ManageWorkflow } from './ManageWorkflow.js'
import {
	Aside,
	AsideHeader,
	Container,
	historyButtonStyles,
	icons,
	InputContainer,
	Main,
	OutputContainer,
	SectionTitle,
	TableContainer,
	TextContainer,
	Title,
	WorkflowContainer,
} from './PrepareDataFull.styles.js'
import type { PrepareDataFullProps } from './PrepareDataFull.types.js'
import { TableListBar } from './TableListBar.js'

export const PrepareDataFull: React.FC<PrepareDataFullProps> = memo(
	function PrepareDataFull({
		inputs,
		derived,
		workflow: wf,
		selectedTableId,
		outputHeaderCommandBar,
		stepsPosition = 'bottom',
		selectedColumn,
		onColumnClick,
		onSelectedTableIdChanged,
		onUpdateOutput,
		onUpdateWorkflow,
	}) {
		const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)
		const workflow = useWorkflow(wf, inputs)

		const selectedTable =
			derived.find(t => t.id === selectedTableId) ??
			inputs.find(t => t.id === selectedTableId)

		const onUpdateMetadata = useCallback(
			(meta: TableMetadata) => {
				if (selectedTable) {
					selectedTable.metadata = meta
				}
			},
			[selectedTable],
		)

		// parallel array of output names for the steps
		const outputs = useStepOutputs(workflow)
		const steps = useWorkflowSteps(workflow)
		useWorkflowOutputListener(workflow, onUpdateOutput)
		// useWorkflowListener(workflow, onUpdateWorkflow)

		return (
			<Container isCollapsed={isCollapsed}>
				<Main>
					<InputContainer>
						<SectionTitle>Tables</SectionTitle>
						<TableListBar
							loading={false}
							inputs={inputs}
							derived={derived}
							selected={selectedTableId}
							onSelect={onSelectedTableIdChanged}
						/>
						{isCollapsed ? (
							<HistoryButton
								onClick={toggleCollapsed}
								steps={steps.length || 0}
								showText={true}
							/>
						) : null}
					</InputContainer>
					<OutputContainer stepsPosition={stepsPosition}>
						<SectionTitle>Preview</SectionTitle>
						{selectedTable?.table ? (
							<TableContainer>
								<ArqueroTableHeader
									commandBar={outputHeaderCommandBar}
									name={selectedTable?.id}
									table={selectedTable?.table}
								/>
								<ArqueroDetailsList
									isSortable
									compact
									showColumnBorders
									isHeadersFixed
									isColumnClickable={!!onColumnClick}
									selectedColumn={selectedColumn}
									onColumnClick={onColumnClick}
									onChangeMetadata={onUpdateMetadata}
									metadata={selectedTable?.metadata}
									table={selectedTable?.table}
								/>
							</TableContainer>
						) : (
							<TextContainer>
								<DetailText text="(No table selected)" />
							</TextContainer>
						)}
					</OutputContainer>
				</Main>
				<Aside isCollapsed={isCollapsed}>
					<AsideHeader isCollapsed={isCollapsed}>
						<HistoryButton styles={historyButtonStyles} />
						<Title isCollapsed={isCollapsed}>
							History ({workflow?.steps?.length || 0})
							<IconButton
								iconProps={icons.cancel}
								onClick={toggleCollapsed}
								ariaLabel="Close"
							/>
						</Title>
					</AsideHeader>
					<WorkflowContainer isCollapsed={isCollapsed}>
						<ManageWorkflow
							inputs={inputs}
							workflow={workflow}
							onSelect={onSelectedTableIdChanged}
							onUpdateOutput={onUpdateOutput}
							onUpdateWorkflow={onUpdateWorkflow}
							historyView={true}
							outputs={outputs}
						/>
					</WorkflowContainer>
				</Aside>
			</Container>
		)
	},
)
