/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	HistoryButton,
	HistoryIcon,
	ManageWorkflow,
	ProjectMgmtCommandBar,
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
import { IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useThematic } from '@thematic/react'
import { memo, useCallback, useState } from 'react'

import { useStepListener, useTables } from './PrepareDataPage.hooks.js'
import {
	Aside,
	AsideHeader,
	ButtonContainer,
	Container,
	DetailsListContainer,
	icons,
	Main,
	mgmtStyles,
	OutputContainer,
	PageContainer,
	PrepareDataContainer,
	Title,
	WorkflowContainer,
} from './PrepareDataPage.styles.js'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const theme = useThematic()
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
	const onDelete = useOnDeleteStep(workflow)
	const inputNames = useInputTableNames(workflow)

	useStepListener(workflow, setSelectedTableId, inputNames)
	useWorkflowOutputListener(workflow, setOutputs)
	useWorkflowListener(workflow, setWorkflow)

	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()

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
										name={selectedTable?.id}
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
										// onChangeMetadata={onUpdateMetadata}
										metadata={selectedTable?.metadata}
										table={selectedTable?.table}
										features={{ smartHeaders: true }}
									/>
								</DetailsListContainer>
							)}
						</OutputContainer>
					</Main>
					<Aside isCollapsed={isCollapsed}>
						<AsideHeader isCollapsed={isCollapsed}>
							<HistoryIcon color={theme.application().accent().hex()} />
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
								onSelect={setSelectedTableId}
								onUpdateOutput={setOutputs}
								onUpdateWorkflow={setWorkflow}
								historyView={true}
							/>
						</WorkflowContainer>
					</Aside>
				</Container>
			</PrepareDataContainer>
		</PageContainer>
	)
})
