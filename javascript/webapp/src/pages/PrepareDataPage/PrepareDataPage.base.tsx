/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	HistoryPanel,
	ProjectManagementCommandBar,
	StepHistoryList,
	TableCommands,
	useManagementBarDefaults,
	useOnCreateStep,
	useOnDeleteStep,
	useOnSaveStep,
	useWorkflowOutputListener,
} from '@datashaper/react'
import { useInputTableNames } from '@datashaper/react/src/hooks/useTableDropdownOptions.js'
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import type { IColumn } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import upperFirst from 'lodash-es/upperFirst.js'
import { memo, useCallback, useMemo, useState } from 'react'

import { TableList } from './components/TableList.js'
import {
	useHistory,
	useInputListener,
	useStepListener,
	useTables,
} from './PrepareDataPage.hooks.js'
import {
	DetailsListContainer,
	DetailsListRowsContainer,
	EditorContainer,
	PageContainer,
	PrepareDataContainer,
} from './PrepareDataPage.styles.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()

	const { tables: inputs, onAddTables: onAddInputTables } =
		useTables(setSelectedTableId)
	const [outputs, setOutputs] = useState<TableContainer[]>([])

	// state for the input tables
	const [workflow, setWorkflow] = useState<Workflow>(new Workflow())

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
	useInputListener(workflow, inputs)

	const onDelete = useOnDeleteStep(workflow)

	const onColumnClick = useCallback(
		(_?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => {
			setSelectedColumn(column?.name)
		},
		[setSelectedColumn],
	)

	const managementProps = useManagementBarDefaults()
	const { historyProps, isCollapsed, toggleCollapsed } = useHistory(workflow)
	return (
		<PageContainer className={'prepare-data-page'}>
			<ProjectManagementCommandBar
				{...managementProps}
				tables={inputs}
				workflow={workflow}
				outputTables={outputs}
				onUpdateWorkflow={setWorkflow}
				onUpdateTables={onAddInputTables}
			/>
			<PrepareDataContainer>
				<TableList
					loading={false}
					inputs={inputs}
					derived={outputs}
					selected={selectedTableId}
					onSelect={setSelectedTableId}
				/>
				{selectedTable?.table && (
					<EditorContainer isCollapsed={isCollapsed}>
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
								farCommandBar={<CommandBar {...historyProps} />}
								name={tableName}
								table={selectedTable?.table}
							/>
							<DetailsListRowsContainer>
								<ArqueroDetailsList
									sortable
									compact
									showColumnBorders
									isHeaderFixed
									fill
									striped
									clickableColumns={!!onColumnClick}
									selectedColumn={selectedColumn}
									onColumnClick={onColumnClick}
									metadata={selectedTable?.metadata}
									table={selectedTable?.table}
									features={{ smartHeaders: true }}
								/>
							</DetailsListRowsContainer>
						</DetailsListContainer>
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
					</EditorContainer>
				)}
			</PrepareDataContainer>
		</PageContainer>
	)
})
