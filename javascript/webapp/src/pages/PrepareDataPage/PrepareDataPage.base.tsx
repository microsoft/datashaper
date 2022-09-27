/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	HistoryButton,
	HistoryPanel,
	ProjectMgmtCommandBar,
	StepHistoryList,
	TableCommands,
	useOnCreateStep,
	useOnDeleteStep,
	useOnSaveStep,
	useWorkflow,
	useWorkflowListener,
	useWorkflowOutputListener,
} from '@datashaper/react'
import { TableListBar } from '@datashaper/react/src/components/TableListBar.js'
import { useInputTableNames } from '@datashaper/react/src/hooks/useTableDropdownOptions.js'
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import type { IColumn } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import upperFirst from 'lodash-es/upperFirst.js'
import { memo, useCallback, useMemo, useState } from 'react'

import { useStepListener, useTables } from './PrepareDataPage.hooks.js'
import {
	ButtonContainer,
	Container,
	DetailsListContainer,
	Main,
	mgmtStyles,
	OutputContainer,
	PageContainer,
	PrepareDataContainer,
} from './PrepareDataPage.styles.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()

	const { tables: inputs, onAddTables: onAddInputTables } =
		useTables(setSelectedTableId)
	const [outputs, setOutputs] = useState<TableContainer[]>([])

	// state for the input tables
	const [wf, setWorkflow] = useState<Workflow>(new Workflow())
	// workflow steps/output
	const workflow = useWorkflow(wf, inputs)

	const selectedTable = inputs
		.concat(outputs)
		.find(x => x.id === selectedTableId)

	const onSave = useOnSaveStep(workflow)
	const onCreate = useOnCreateStep(onSave, setSelectedTableId)
	const inputNames = useInputTableNames(workflow)

	const tableName = useMemo(() => {
		const stepIndex = workflow.steps.findIndex(x => x.id === selectedTableId)
		const name = upperFirst(workflow.steps[stepIndex]?.verb)
		return stepIndex >= 0 ? `#${stepIndex + 1} ${name}` : selectedTableId
	}, [workflow, selectedTableId])

	useStepListener(workflow, setSelectedTableId, inputNames)
	useWorkflowOutputListener(workflow, setOutputs)
	useWorkflowListener(workflow, setWorkflow)

	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()

	const onDelete = useOnDeleteStep(workflow)

	const onColumnClick = useCallback(
		(_?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => {
			setSelectedColumn(column?.name)
		},
		[setSelectedColumn],
	)

	return (
		<PageContainer className={'prepare-data-page'}>
			<ProjectMgmtCommandBar
				tables={inputs}
				workflow={workflow}
				outputTables={outputs}
				onUpdateWorkflow={setWorkflow}
				onUpdateTables={onAddInputTables}
				styles={mgmtStyles}
			/>
			<PrepareDataContainer>
				<Container isCollapsed={isCollapsed}>
					<Main>
						<ButtonContainer>
							<TableListBar
								loading={false}
								inputs={inputs}
								derived={outputs}
								selected={selectedTableId}
								onSelect={setSelectedTableId}
							/>
							<HistoryButton
								onClick={toggleCollapsed}
								title="Steps"
								steps={workflow?.steps?.length}
								showText={true}
								styles={{
									root: { visibility: !isCollapsed ? 'hidden' : 'visible' },
								}}
							/>
						</ButtonContainer>
						<OutputContainer>
							{selectedTable?.table && (
								<DetailsListContainer>
									<ArqueroTableHeader
										commandBar={
											<TableCommands
												inputTable={selectedTable}
												workflow={workflow}
												onAddStep={onCreate}
												selectedColumn={selectedColumn}
												onRemoveStep={onDelete}
											/>
										}
										name={tableName}
										table={selectedTable?.table}
									/>
									<ArqueroDetailsList
										sortable
										compact
										showColumnBorders
										isHeaderFixed
										clickableColumns={!!onColumnClick}
										selectedColumn={selectedColumn}
										onColumnClick={onColumnClick}
										metadata={selectedTable?.metadata}
										table={selectedTable?.table}
										features={{ smartHeaders: true }}
									/>
								</DetailsListContainer>
							)}
						</OutputContainer>
					</Main>
					<HistoryPanel
						title="Steps"
						isCollapsed={isCollapsed}
						toggleCollapsed={toggleCollapsed}
						steps={workflow.steps}
						showStepCount
					>
						<StepHistoryList
							onDelete={onDelete}
							onSelect={setSelectedTableId}
							workflow={workflow}
							onSave={onSave}
						/>
					</HistoryPanel>
				</Container>
			</PrepareDataContainer>
		</PageContainer>
	)
})
