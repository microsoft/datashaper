/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	DisplayOrder,
	StepList,
	TableCommands,
	useOnCreateStep,
	useOnDeleteStep,
	useOnSaveStep,
	useWorkflowInputTableNames,
	useWorkflowOutputListener,
} from '@datashaper/react'
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import { ToolPanel } from '@essex/components'
import type { IColumn } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import upperFirst from 'lodash-es/upperFirst.js'
import { memo, useCallback, useMemo, useState } from 'react'

import { ProjectManagementCommandBar } from '../../components/common/ProjectManagementCommandBar.js'
import { useManagementBarDefaults } from '../../hooks/useManagementBarDefaults.js'
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
	StepsListContainer,
} from './PrepareDataPage.styles.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()

	const { tables: inputs, onAddTables: onAddInputTables } =
		useTables(setSelectedTableId)
	const [outputs, setOutputs] = useState<TableContainer[]>([])

	// state for the input tables
	const [workflow, setWorkflow] = useState<Workflow>(() => new Workflow())

	const selectedTable = useMemo(
		() => inputs.concat(outputs).find(x => x.id === selectedTableId),
		[inputs, outputs, selectedTableId],
	)

	const onSave = useOnSaveStep(workflow)
	const onCreate = useOnCreateStep(onSave, setSelectedTableId)
	const inputNames = useWorkflowInputTableNames(workflow)

	const tableName = useMemo(() => {
		const stepIndex = workflow.steps.findIndex(x => x.id === selectedTableId)
		const name = upperFirst(workflow.steps[stepIndex]?.verb)
		return stepIndex >= 0 ? `#${stepIndex + 1} ${name}` : selectedTableId
	}, [workflow, selectedTableId])

	const deleteStepFromWorkflow = useOnDeleteStep(workflow)

	useStepListener(workflow, setSelectedTableId, inputNames)
	useWorkflowOutputListener(workflow, setOutputs)
	useInputListener(workflow, inputs)

	const onDeleteStep = useCallback(
		(index: number) => {
			for (let i = workflow.steps.length - 1; i >= index; i--) {
				deleteStepFromWorkflow(index)
			}
			setSelectedTableId(outputs[index - 1]?.id)
		},
		[workflow, outputs, deleteStepFromWorkflow],
	)

	const onColumnClick = useCallback(
		(_?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => {
			setSelectedColumn(column?.name)
		},
		[setSelectedColumn],
	)

	const managementProps = useManagementBarDefaults()
	const { historyCommandProps, isOpen, historyPanelProps } =
		useHistory(workflow)
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
					<EditorContainer isOpen={isOpen}>
						<DetailsListContainer>
							<ArqueroTableHeader
								commandBar={
									<TableCommands
										inputTable={selectedTable}
										workflow={workflow}
										metadata={selectedTable.metadata}
										onAddStep={onCreate}
										selectedColumn={selectedColumn}
										onRemoveStep={onDeleteStep}
									/>
								}
								farCommandBar={<CommandBar {...historyCommandProps} />}
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
						<StepsListContainer>
							<ToolPanel {...historyPanelProps}>
								<StepList
									onDelete={onDeleteStep}
									onSelect={setSelectedTableId}
									workflow={workflow}
									onSave={onSave}
									selectedKey={selectedTableId}
									order={DisplayOrder.FirstOnTop}
								/>
							</ToolPanel>
						</StepsListContainer>
					</EditorContainer>
				)}
			</PrepareDataContainer>
		</PageContainer>
	)
})
